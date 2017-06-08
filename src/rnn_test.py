
from keras.preprocessing import sequence, text
import pickle
from keras.models import model_from_json

def prepare():
    f = open("tokenizer_sung.txt", "rb")
    tk = pickle.load(f)
    f.close()
    json_file = open('model_cnn+rnn_20_0.2.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    # load weights into new model
    loaded_model.load_weights("weights_cnn+rnn_20_0.2.h5")
    print("Loaded model from disk")
    return tk,loaded_model


def model_test(tk,loaded_model,x1,x2):
    max_len = 40

    x1 = tk.texts_to_sequences([x1])
    x1 = sequence.pad_sequences(x1, maxlen=max_len)
    x2 = tk.texts_to_sequences([x2])
    x2 = sequence.pad_sequences(x2, maxlen=max_len)

    print(x1)
    print(x2)

    #loaded_model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
    test = loaded_model.predict([x1,x2,x1,x2,x1,x2], batch_size=1, verbose=0)
    return test[0][0]