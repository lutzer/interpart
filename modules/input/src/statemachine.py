from aenum import AutoNumberEnum

class State(AutoNumberEnum):
    WAITING_FOR_KEY = (),
    FETCH_QUESTION = (),
    ASKING_QUESTION = (),
    LISTENING = (),
    SENDING = (),
    OUTPUT = (),
    ERROR = ()

class Action(AutoNumberEnum):
    SET_LANGUAGE = (),
    SET_QUESTION = (),
    DONE = (),
    SEND_ANSWER = (),
    RESET = (),
    THROW_ERROR = (),
    TIMEOUT = ()

class StateMachine:
    def __init__(self, initialState = State.WAITING_FOR_KEY):
        self.initialState = initialState
        self.reset()

    def reset(self):
        self.status = self.initialState
        self.language = None
        self.question = None
        self.answer = None
        self.error = None

    def consumeAction(self, action, **args):
        if action == Action.RESET:
            self.reset()

        if action == Action.THROW_ERROR:
            self.status = State.ERROR
            self.error = args.get("error")

        if self.status == State.WAITING_FOR_KEY:
            if action == Action.SET_LANGUAGE:
                self.language = args.get("language")
                self.status = State.FETCH_QUESTION

        elif self.status == State.FETCH_QUESTION:
            if action == Action.SET_QUESTION:
                self.question = args.get("question")
                self.status = State.ASKING_QUESTION

        elif self.status == State.ASKING_QUESTION:
            if action == Action.DONE:
                self.status = State.LISTENING

        elif self.status == State.LISTENING:
            if action == Action.SEND_ANSWER:
                self.answer = args.get("answer")
                self.status = State.SENDING

        elif self.status == State.SENDING:
            if action == Action.DONE:
                self.status = State.OUTPUT

        elif self.status == State.OUTPUT:
            if action == Action.DONE:
                self.reset()

        elif self.status == State.ERROR:
            if action == Action.TIMEOUT:
                self.reset()
