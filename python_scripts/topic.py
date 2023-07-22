# Run using: python <path-to-topic.py> <number_of_topics>
# E.g. python topic.py ./sample.json 3

from gensim.models import LdaMulticore
from gensim.corpora.dictionary import Dictionary
import pandas as pd
import spacy
import warnings
import sys
import json
warnings.filterwarnings("ignore")

def format_topics_sentences(ldamodel, corpus, texts):
    # Init output
    topic_info_list = []

    # Get main topic in each document
    for i, row in enumerate(ldamodel[corpus]):
        row = sorted(row, key=lambda x: (x[1]), reverse=True)
        # Get the Dominant topic, Perc Contribution and Keywords for each document
        for j, (topic_num, prop_topic) in enumerate(row):
            if j == 0:  # => dominant topic
                wp = ldamodel.show_topic(topic_num)
                topic_keyword = wp[0][0]  # use only the most representative keyword for each topic
                topic_info_list.append([int(topic_num), round(prop_topic, 4), topic_keyword])
                break

    return topic_info_list


if __name__ == "__main__":

    nlp = spacy.load('en_core_web_sm')

    path_to_data = sys.argv[1]
    with open(path_to_data) as f:
        json_data = json.load(f)

    data_array = []
    for key in json_data:
        data_array += [(entry["message"], entry) for entry in json_data[key]]

    number_of_topics = int(sys.argv[2])

    if len(data_array) == 0:
        sys.exit()

    # creating the dataframe
    data = pd.DataFrame(data = data_array, 
                        columns = ['text', 'original_entry'])

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

    topics = format_topics_sentences(ldamodel=lda_model, corpus=corpus, texts=data)

    for i in range(len(data)):
        data['original_entry'][i]['topic'] = topics[i][2] # Adding only the dominant keyword

    with open(path_to_data, "w") as f:
        f.write(json.dumps(json_data))
