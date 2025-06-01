# PlanVenture Setup Guide

## Virtual Environment Setup

1. Create a new virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
```bash
.\venv\Scripts\activate
```
- On Mac/Linux:
```bash
source venv/bin/activate
```

3. Install project requirements:
```bash
pip install -r requirements.txt
```

## Running Tests
```bash
# Install pytest if not included in requirements
pip install pytest

# Run all tests
pytest

# Run specific test file
pytest tests/test_email_service.py
```

## Project Structure
```
planventure/
├── venv/               # Virtual environment (ignored by git)
├── planventure-api/   
│   ├── utils/         # Utility functions
│   └── tests/         # Test files
└── requirements.txt   # Project dependencies
```

## Requirements File

Create requirements.txt with:
```bash
pip freeze > requirements.txt
```

Current project dependencies:
```
pytest==7.4.3
python-dotenv==1.0.0
google-auth==2.23.4
google-api-python-client==2.108.0
```
