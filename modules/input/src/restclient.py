import requests
import json

class RestClient:

    def __init__(self, apiAdress):
        self.apiAdress = apiAdress

    def getQuestions(self, language):
        url = self.apiAdress + "/questions/list?lang=" + language
        response = requests.get(url)
        data = response.json()["data"]
        return data

    def getQuestion(self, id):
        url = self.apiAdress + "/questions/get/" + id
        response = requests.get(url)
        data = response.json()["data"]
        return data

    def getGreeting(self, language):
        url = self.apiAdress + "/response/greeting?lang=" + language
        response = requests.get(url)
        data = response.json()["data"]
        return data

    def getGoodbye(self, language):
        url = self.apiAdress + "/response/goodbye?lang=" + language
        response = requests.get(url)
        data = response.json()["data"]
        return data

    def postAnswer(self, submission):
        url = self.apiAdress + "/submissions/add"
        response = requests.post(url, json=submission)
        return response.json()