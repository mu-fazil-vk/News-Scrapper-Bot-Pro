FROM buildkite/puppeteer:latest

RUN apt update
RUN apt-get install -y git
RUN git clone https://github.com/fazmovies/News-Scrapper-Bot /root/News-Scrapper-Bot
WORKDIR /root/News-Scrapper-Bot/
RUN npm install supervisor -g
RUN apt install -y libgbm-dev

RUN npm install
CMD ["npm", "start"]
