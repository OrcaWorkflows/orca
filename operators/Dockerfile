FROM python:3.8-slim-buster

RUN apt-get update
RUN apt-get -y install build-essential libpq-dev python3-dev unixodbc-dev

COPY requirements.txt ./
RUN pip --no-cache-dir install -r requirements.txt

WORKDIR /orca-operator

COPY . /orca-operator/
ENV PYTHONPATH "${PYTHONPATH}:/orca-operator/"

CMD ["python3.8", "initiators/initiator.py"]
