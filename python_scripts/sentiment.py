# Run using: python <comment/response>
# E.g. python sentiment.py "You're from a whole other world"

# Example of output:
# 1
# <positive>

import sys
import pickle
from gensim import models
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.models import Word2Vec
from gensim.models import LdaMulticore
from gensim.corpora.dictionary import Dictionary
import pandas as pd
import spacy
import warnings
warnings.filterwarnings("ignore")

nlp = spacy.load('en_core_web_sm')

# loading models
# w2v_model = models.Word2Vec.load("./dependencies/w2v_model.model")
w2v_model = models.Word2Vec.load("../python_scripts/dependencies/w2v_model.model")
# lg_model = pickle.load(open("./dependencies/lg_model.sav", 'rb'))
lg_model = pickle.load(open("../python_scripts/dependencies/lg_model.sav", 'rb'))

data_array = sys.argv[1]

index_values = range(0, 1)
   
# creating a list of column names
column_values = ['text']
  
# creating the dataframe
data = pd.DataFrame(data = data_array, 
                  index = index_values, 
                  columns = column_values)

def prepareData(data):
    clean_text = []

    for text in nlp.pipe(data['text'], disable=["tagger", "parser", "ner"]): #Disable part of the pipeline to make it faster
        txt = [token.lemma_.lower() for token in text 
            if token.is_alpha # having only alphanumreical values
            and not token.is_stop #removing stopwords
            and not token.is_punct] #removing punctuations
        #Appending the above to 'clean_text'
        clean_text.append(txt)

    data['clean_text'] = clean_text

    def dummy_fun(doc):
        return doc
    
    tfidf = TfidfVectorizer(vocabulary=w2v_model.wv.key_to_index.keys(),
                            tokenizer=dummy_fun,
                            preprocessor=dummy_fun,
                            token_pattern=None)
    
    data_tfidf = tfidf.fit_transform(data['clean_text'])
    data_w2v_tfidf = data_tfidf @ w2v_model.wv.vectors
    return(data_w2v_tfidf)


dataToPredict = prepareData(data)
results = lg_model.predict(dataToPredict)

if results[0]=="positive":
    print("1")  
elif results[0]=="negative":
    print("-1")
else:
    print("0")