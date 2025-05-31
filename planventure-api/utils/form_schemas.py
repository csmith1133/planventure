PURCHASE_REQUEST_SCHEMA = {
    "required": [
        "requestor_org",
        "requestor_eat",
        "requestor_director",
        "account_code",
        "description",
        "total_amount",
    ],
    "properties": {
        "requestor_org": {"type": "string"},
        "requestor_eat": {"type": "string"},
        "requestor_director": {"type": "string"},
        "account_code": {"type": "string"},
        "description": {"type": "string"},
        "total_amount": {"type": "number"},
        "supporting_docs": {"type": "array", "items": {"type": "string"}},
    },
}

PAYMENT_REQUEST_SCHEMA = {
    "required": [
        "paying_entity",
        "payment_amount",
        "paying_currency",
        "vendor_name",
        "legal_approval",
        "payment_method",
    ],
    "properties": {
        "paying_entity": {"type": "string"},
        "payment_amount": {"type": "number"},
        "paying_currency": {"type": "string"},
        "vendor_name": {"type": "string"},
        "legal_approval": {"type": "boolean"},
        "payment_method": {"type": "string"},
    },
}

FORM_TYPES = {
    "purchase_request": {
        "name": "Purchase Request Form",
        "description": "Submit a purchase request for approval",
        "category": "finance",
    },
    "payment_request": {
        "name": "Payment Request Form",
        "description": "Request a one-time payment to vendor",
        "category": "finance",
    },
}

FORM_SCHEMAS = {
    "purchase_request": PURCHASE_REQUEST_SCHEMA,
    "payment_request": PAYMENT_REQUEST_SCHEMA,
}
