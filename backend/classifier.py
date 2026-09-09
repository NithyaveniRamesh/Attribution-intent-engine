PURCHASE_SIGNALS = [
    "checkout",
    "checkout link",
    "payment",
    "pay",
    "place an order",
    "place order",
    "i'll take it",
    "ill take it",
    "i will take it",
    "i want to order",
    "i want two",
    "add this to my order",
    "send me the link",
]

INQUIRY_SIGNALS = [
    "is this available",
    "available",
    "what size",
    "what sizes",
    "what color",
    "what colours",
    "how much",
    "price",
    "shipping",
    "when will it arrive",
]

AMBIGUOUS_SIGNALS = [
    "okay",
    "ok",
    "sure",
    "send it",
    "i'll think about it",
    "ill think about it",
    "let me think",
]


def classify_conversation(conversation: str) -> dict:
    text = conversation.lower().strip()

    purchase_score = 0
    inquiry_score = 0
    ambiguous_score = 0

    for signal in PURCHASE_SIGNALS:
        if signal in text:
            purchase_score += 1

    for signal in INQUIRY_SIGNALS:
        if signal in text:
            inquiry_score += 1

    for signal in AMBIGUOUS_SIGNALS:
        if signal in text:
            ambiguous_score += 1

    if purchase_score > 0:
        intent = "INTENT_TO_BUY"
        confidence = min(0.91 + (purchase_score - 1) * 0.02, 0.98)
        status = "AUTOMATIC"
        reason = "Customer expressed a clear purchase or checkout-related action."
        review_required = False

    elif ambiguous_score > 0:
        intent = "CUSTOMER_INQUIRY"
        confidence = 0.62
        status = "PROVISIONAL"
        reason = "Customer showed interest, but did not clearly commit to purchasing."
        review_required = True

    elif inquiry_score > 0:
        intent = "CUSTOMER_INQUIRY"
        confidence = 0.84
        status = "AUTOMATIC"
        reason = "Customer asked for product, availability, pricing, or shipping information."
        review_required = False

    else:
        intent = "UNCERTAIN"
        confidence = 0.42
        status = "PROVISIONAL"
        reason = "The conversation does not contain enough evidence to determine customer intent."
        review_required = True

    return {
        "intent": intent,
        "confidence": confidence,
        "status": status,
        "reason": reason,
        "review_required": review_required,
        "attribution_continues": True,
    }