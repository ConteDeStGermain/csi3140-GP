from transformers import AutoModelForSequenceClassification
from transformers import AutoTokenizer, AutoConfig
import numpy as np
from os import sys
import sys
import inspect

from scipy.special import softmax

import warnings
warnings.filterwarnings("ignore")

from transformers import logging
logging.set_verbosity_error()

def traceit(frame, event, arg):
    function_code = frame.f_code
    function_name = function_code.co_name
    lineno = frame.f_lineno
    vars = frame.f_locals

    try:
        source_lines, starting_line_no = inspect.getsourcelines(frame.f_code)
        loc = f"{function_name}:{lineno} {source_lines[lineno - starting_line_no].rstrip()}"
        vars = ", ".join(f"{name} = {vars[name]}" for name in vars)
        print(f"{loc:50} ({vars})")
    except:
        pass
   
    return traceit


MODEL = f"cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(MODEL)
config = AutoConfig.from_pretrained(MODEL)
# PT
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

sys.settrace(traceit)
text = sys.argv[1]
sys.settrace(None)
encoded_input = tokenizer(text, return_tensors='pt')
output = model(**encoded_input)
scores = output[0][0].detach().numpy()
sys.settrace(traceit)
scores = softmax(scores)

ranking = np.argsort(scores)
ranking = ranking[::-1]

allSentimentResults = scores.tolist()
mostLikely = max(allSentimentResults)
print(allSentimentResults.index(mostLikely)-1, mostLikely)
sys.settrace(None)