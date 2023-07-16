# Run using: python <path-to-topic.py> <number_of_topics>
# E.g. python topic.py ./sample.json 3

# Example of output:
# [[0, 0, 0.6650999784469604, "comment"], [1, 2, 0.776199996471405, "hate"], [2, 1, 0.8309000134468079, "lovely"], [3, 1, 0.774399995803833, "lovely"]]
# [[document_#, topic_#, topic_percent_of_document, topic_name], [...], ...]

from gensim.models import LdaMulticore
from gensim.corpora.dictionary import Dictionary
import pandas as pd
import gensim.models as gm
import spacy
import warnings
import sys
import json
warnings.filterwarnings("ignore")

def format_topics_sentences(ldamodel, corpus, texts):
    # Init output
    sent_topics_df = pd.DataFrame()

    # Get main topic in each document
    for i, row in enumerate(ldamodel[corpus]):
        row = sorted(row, key=lambda x: (x[1]), reverse=True)
        # Get the Dominant topic, Perc Contribution and Keywords for each document
        for j, (topic_num, prop_topic) in enumerate(row):
            if j == 0:  # => dominant topic
                wp = ldamodel.show_topic(topic_num)
                topic_keywords = wp[0][0]
                sent_topics_df = sent_topics_df.append(pd.Series([int(topic_num), round(prop_topic,4), topic_keywords]), ignore_index=True)
            else:
                break

    return(sent_topics_df)


if __name__ == "__main__":

    nlp = spacy.load('en_core_web_sm')
    
    path_to_data = sys.argv[1]
    f = open(path_to_data)
    data_array = json.load(f)

    number_of_topics = sys.argv[2]

    index_values = range(0, len(data_array))
    
    # creating a list of column names
    column_values = ['text']
    
    # creating the dataframe
    data = pd.DataFrame(data = data_array, 
                    index = index_values, 
                    columns = column_values)

    clean_text = []

    for text in nlp.pipe(data['text'], disable=["tagger", "parser", "ner"]): #Disable part of the pipeline to make it faster
        txt = [token.lemma_.lower() for token in text 
            if token.is_alpha # having only alphanumreical values
            and not token.is_stop #removing stopwords
            and not token.is_punct] #removing punctuations
        #Appending the above to 'clean_text'
        clean_text.append(txt)

    data['clean_text'] = clean_text

    dictionary = Dictionary(data['clean_text'])
    corpus = [dictionary.doc2bow(doc) for doc in data['clean_text']]
    lda_model = LdaMulticore(corpus, id2word=dictionary, num_topics=number_of_topics, workers=5, passes=10)

    df_topic_sents_keywords = format_topics_sentences(ldamodel=lda_model, corpus=corpus, texts=data)

    # Format
    df_dominant_topic = df_topic_sents_keywords.reset_index()

    f = open("output.json", "w")
    f.write(json.dumps(df_dominant_topic.values.tolist()))
    f.close()

