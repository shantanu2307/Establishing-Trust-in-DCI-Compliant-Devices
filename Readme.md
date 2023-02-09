### To setup the project

```
cd BTP2
pip3 install virtualenv
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

### To run the project

```
cd BTP2
source venv/bin/activate
python3 wsgi.py
```

### To update the requirements

```
pip freeze > requirements.txt
```

### To deactivate the virtual environment

```
deactivate
```