from transformers import AutoModelForSequenceClassification
from transformers import AutoTokenizer, AutoConfig
import numpy as np
from os import sys

from scipy.special import softmax

import warnings
warnings.filterwarnings("ignore")

from transformers import logging
logging.set_verbosity_error()

MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
config = AutoConfig.from_pretrained(MODEL)
# PT
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

text = sys.argv[1]

encoded_input = tokenizer(text, return_tensors='pt')
output = model(**encoded_input)
scores = output[0][0].detach().numpy()
scores = softmax(scores)

ranking = np.argsort(scores)
ranking = ranking[::-1]

allSentimentResults = scores.tolist()
mostLikely = max(allSentimentResults)
print(allSentimentResults.index(mostLikely)-1, mostLikely)