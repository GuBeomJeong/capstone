from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
from flask import send_from_directory
import rnn_test
import json
import crawl_quora
import numpy
app = Flask(__name__)




@app.route("/")
def compare(name = None):
    global tk
    global loaded_model
    try:
        tk
    except NameError:
        tk, loaded_model = rnn_test.prepare()
        return render_template('index.html')
    else:
        return render_template('index.html')
    # if tk in globals():
    #     return render_template('index.html')
    # else:
    #     tk, loaded_model = rnn_test.prepare()
    #     return render_template('index.html')


@app.route("/crawl",methods=['GET', 'POST'])
def crawling():
    if request.method == 'POST':
        validate_list = []
        data = request.data.decode('utf-8')
        data = json.loads(data)
        context = data['context_data']
        title_list = crawl_quora.crawl_data(context)
        for title in title_list:
            validate = rnn_test.model_test(tk,loaded_model,context,title)
            validate_list.append([title,str(validate)])

        return json.dumps(validate_list)
    else:
        return render_template('crawl.html')


@app.route('/data', methods=['GET', 'POST'])
def data():
    if request.method == 'POST':
        data = request.data.decode('utf-8')
        data = json.loads(data)
        print(data)
        validate = rnn_test.model_test(tk,loaded_model,data['context_data1'],data['context_data2'])
        validate = str(validate)
        return json.dumps({'similarity':validate})
    else:
        return "get_data"


if __name__ == "__main__":
    app.run(debug=True)




