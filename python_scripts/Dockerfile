FROM python:3

WORKDIR /app/python_scripts

COPY sentiment.py ./
COPY topic.py ./
COPY requirements.txt ./

RUN python -m pip install --upgrade pip
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117
RUN conda install -c conda-forge hdbscan
RUN pip install -r requirements.txt