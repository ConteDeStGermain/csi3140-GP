FROM continuumio/miniconda3 as deps
RUN conda install -c conda-forge hdbscan

# FROM python:3.8 as build

# WORKDIR /app/backend
# RUN python -m venv /app/backend/venv
# ENV PATH="/app/backend/venv/bin:$PATH"

# COPY ./scripts/requirements.txt .

# RUN python -m pip install --upgrade pip
# RUN pip install -r requirements.txt


# FROM node:18

# WORKDIR /app/backend
# COPY --from=build /app/backend/venv /venv

# ENV PATH="/app/backend/venv/bin:$PATH"
# ENV NODE_ENV=container

# COPY package.json package-lock.json ./
# RUN npm install

# COPY . .

# EXPOSE 8080
# CMD [ "node", "server.js" ]

FROM python:3.8 as builder

RUN mkdir /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 18.16.1
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# confirm installation
RUN npm -v
RUN node -v

ENV SERVER_PATH /app/backend
ENV GENERATOR_PATH /app/backend/scripts
RUN mkdir -p $SERVER_PATH $GENERATOR_PATH

RUN python -m pip install --upgrade pip
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117

COPY ./scripts/requirements.txt $GENERATOR_PATH/requirements.txt
RUN pip install -r $GENERATOR_PATH/requirements.txt

COPY ./package.json $SERVER_PATH/package.json
COPY ./package-lock.json $SERVER_PATH/package-lock.json
RUN cd $SERVER_PATH && npm install

COPY . $SERVER_PATH

WORKDIR $SERVER_PATH

EXPOSE 8080

CMD [ "node", "server.js" ]

#================================================================
# FROM node:18

# # Create app directory
# WORKDIR /app/backend

# COPY package.json package-lock.json ./

# # Bundle app source
# COPY ./* /app/backend/
# COPY ./node_modules /app/backend/node_modules/

# RUN npm install
# RUN chown -R node /app/backend/node_modules


# FROM python:3.8
# WORKDIR /app/backend/scripts

# RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu117

# COPY ./scripts/* /app/backend/scripts/

# RUN pip install -r requirements.txt


# EXPOSE 8080
# CMD [ "node", "server.js" ]