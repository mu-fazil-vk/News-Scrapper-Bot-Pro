FROM buildkite/puppeteer:latest

RUN apt update
RUN apt-get install -y git
RUN git clone https://github.com/mu-fazil-vk/News-Scrapper-Bot-test /root/News-Scrapper-Bot-test
WORKDIR /root/News-Scrapper-Bot-test/
RUN npm install supervisor -g
RUN apt install -y libgbm-dev

RUN npm install
CMD ["npm", "start"]
