from flask import Flask
app = Flask(__name__)

from flask import request

@app.route('/data', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'test'
    else:
        return 'test_get'