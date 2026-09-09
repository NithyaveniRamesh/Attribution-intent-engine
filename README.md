# SentLogic Attribution Intent Engine

### Confidence-Aware Customer Intent Classification & Human Review Prototype

SentLogic Attribution Intent Engine is a lightweight prototype designed to demonstrate how customer conversations can be analyzed to determine whether a customer is **actively intending to purchase**, is **only seeking information**, or has an **uncertain intent that requires human review**.

The prototype focuses on a practical attribution problem:

> A customer may show interest in a product without actually intending to purchase it.

Instead of treating every positive signal as a purchase, SentLogic uses **intent classification + confidence scoring + human review** to make attribution decisions more reliable.

---

## 1. Problem Statement

In social-commerce conversations such as Instagram DMs, customers often move through different stages of intent.

For example:

```text
"How much does this cost?"
```

does not necessarily mean the customer is going to purchase.

Whereas:

```text
"I want to buy this. Please send me the payment link."
```

is a much stronger purchase signal.

A simple keyword-based system can incorrectly attribute conversations as purchases based on isolated words such as:

* buy
* price
* available
* interested
* order

This can result in inaccurate attribution.

SentLogic addresses this by considering the conversation as a whole and attaching a **confidence score** to the model's decision.

---

## 2. Proposed Solution

The prototype classifies a conversation into three primary intent categories:

| Intent          | Meaning                                                         |
| --------------- | --------------------------------------------------------------- |
| `PURCHASE`      | Customer shows clear intent to purchase                         |
| `INFORMATIONAL` | Customer is primarily seeking information                       |
| `UNCERTAIN`     | Available evidence is insufficient to make a confident decision |

The system also determines whether the decision can be made automatically or should be reviewed by a human.

### Decision Flow

```text
Customer Conversation
        |
        v
Intent Classification
        |
        v
Confidence Scoring
        |
        +----------------------+
        |                      |
   High Confidence        Low Confidence
        |                      |
        v                      v
Automatic Decision       Provisional Decision
                               |
                               v
                         Human Review
                               |
                               v
                         Final Decision
```

The key principle is:

> **Low confidence should not block attribution. It should trigger a review path.**

This allows the system to continue processing conversations while giving humans the ability to correct uncertain decisions.

---

## 3. Prototype Workflow

The prototype demonstrates three important scenarios.

### Scenario 1 — Clear Purchase Intent

Example:

```text
Customer: I want to buy the black Nike shoes in size 9.
Customer: Can you send me the payment link?
```

The system identifies strong purchase signals and can make an automatic decision when confidence is sufficiently high.

```text
Intent: PURCHASE
Status: AUTOMATIC
```

---

### Scenario 2 — Informational Conversation

Example:

```text
Customer: What colors are available?
Brand: Black, white and blue.
Customer: Thanks, I was just checking.
```

The customer is asking for information rather than demonstrating a clear purchasing intention.

```text
Intent: INFORMATIONAL
Status: AUTOMATIC
```

---

### Scenario 3 — Uncertain Intent

Example:

```text
Customer: These shoes look really nice.
Customer: How much are they?
Customer: I might get them later.
```

There are signals of interest, but there is not enough evidence to confidently classify the conversation as a purchase.

The system therefore produces:

```text
Intent: UNCERTAIN
Status: PROVISIONAL
Review Required: YES
```

The conversation can then be sent to the human review queue.

The reviewer can select the final decision, such as:

```text
PURCHASE
```

or

```text
INFORMATIONAL
```

The prototype records both decisions in the decision history.

---

# 4. Key Features

## Confidence-Aware Classification

Every model decision includes a confidence score.

Example:

```text
Intent: UNCERTAIN
Confidence: 42%
Status: PROVISIONAL
```

The confidence score helps distinguish between strong decisions and cases where the system should be cautious.

---

## Automatic vs Provisional Decisions

The prototype separates decisions into two paths:

### Automatic

Used when the system has sufficient confidence.

```text
Conversation
    ↓
Classification
    ↓
High Confidence
    ↓
Automatic Decision
```

### Provisional

Used when the model is uncertain.

```text
Conversation
    ↓
Classification
    ↓
Low Confidence
    ↓
Provisional Decision
    ↓
Human Review
```

---

## Human-in-the-Loop Review

Instead of forcing the model to make every decision, uncertain conversations can be reviewed by a human.

This provides a simple mechanism for handling ambiguous customer conversations.

---

## Decision History

The frontend maintains a lightweight decision history showing:

* Model decision
* Model confidence
* Human decision

Example:

```text
1. Model Decision
   UNCERTAIN — 42% confidence

2. Human Decision
   PURCHASE
```

This demonstrates how a production system could maintain an audit trail of automated and human decisions.

---

## Non-Blocking Attribution Concept

A major design principle of the proposed system is that uncertainty should not stop the entire attribution pipeline.

Instead:

```text
Low Confidence
      |
      v
Provisional Decision
      |
      +----> Attribution continues
      |
      +----> Human review happens separately
```

This allows downstream processing to continue while the uncertain decision is reviewed.

---

# 5. System Architecture

The prototype uses a simple three-layer architecture.

```text
+-----------------------------+
|        Frontend             |
|      HTML / CSS / JS        |
|                             |
| Conversation Input          |
| Result Display              |
| Review Interface            |
| Decision History            |
+--------------+--------------+
               |
               | REST API
               v
+-----------------------------+
|        FastAPI Backend      |
|                             |
| POST /analyze               |
| Request Validation          |
| Intent Classification       |
| Confidence Calculation      |
+--------------+--------------+
               |
               v
+-----------------------------+
|     Classification Layer    |
|                             |
| Conversation Analysis       |
| Intent Decision             |
| Confidence Score            |
| Review Requirement          |
+-----------------------------+
```

The architecture is intentionally lightweight because this project is a **proof of concept**, not a production attribution platform.

---

# 6. Technology Stack

### Frontend

* HTML
* CSS
* JavaScript
* Fetch API

### Backend

* Python
* FastAPI
* Pydantic

### Machine Learning / NLP

* Python-based classification logic
* Intent classification
* Confidence scoring

### Deployment

* GitHub
* Render

---

# 7. Project Structure

```text
Attribution-intent-engine/
│
├── backend/
│   ├── main.py
│   ├── classifier.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
└── README.md
```

---

# 8. API

The backend exposes a simple REST API.

## POST `/analyze`

Analyzes a customer conversation.

### Request

```json
{
  "conversation": "I want to buy the black shoes. Please send me the payment link."
}
```

### Response

```json
{
  "intent": "PURCHASE",
  "confidence": 0.91,
  "status": "AUTOMATIC",
  "reason": "The conversation contains strong purchase intent signals.",
  "review_required": false,
  "attribution_continues": true
}
```

For an uncertain conversation, the response may look like:

```json
{
  "intent": "UNCERTAIN",
  "confidence": 0.42,
  "status": "PROVISIONAL",
  "reason": "The conversation does not contain enough evidence to determine customer intent.",
  "review_required": true,
  "attribution_continues": true
}
```

---

# 9. Running the Project Locally

## Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend

Open:

```text
frontend/index.html
```

using a local development server such as VS Code Live Server.

The frontend sends requests to the FastAPI `/analyze` endpoint.

---

# 10. Deployed Prototype

### Live Frontend

https://attribution-intent-engine-1.onrender.com

### Backend API

https://attribution-intent-engine.onrender.com

### API Documentation

https://attribution-intent-engine.onrender.com/docs

### GitHub Repository

https://github.com/NithyaveniRamesh/Attribution-intent-engine

---

# 11. How to Use the Prototype

### Step 1

Open the deployed frontend.

### Step 2

Enter a customer conversation.

For example:

```text
Customer: Hi, I want to buy the black shoes in size 9.
Customer: Please send me the payment link.
```

### Step 3

Click:

```text
Analyze Conversation
```

### Step 4

Review:

* Intent
* Confidence
* Status
* Reason
* Review requirement

### Step 5

If the conversation is uncertain, use:

```text
Send to Review
```

### Step 6

Select the human decision.

The decision will be added to the history.

---

# 12. Example Test Cases

### Purchase

```text
Customer: I want to order the blue hoodie in medium.
Customer: Please send me the payment link.
```

Expected:

```text
PURCHASE
```

---

### Informational

```text
Customer: What colors are available?
Customer: What material is the product made from?
```

Expected:

```text
INFORMATIONAL
```

---

### Uncertain

```text
Customer: This looks really good.
Customer: How much is it?
Customer: Maybe I'll buy it later.
```

Expected:

```text
UNCERTAIN
```

The conversation can then be sent for human review.

---

# 13. Design Principles

The prototype is based on a few important principles.

### 1. Confidence over binary decisions

Instead of simply returning:

```text
BUY / DON'T BUY
```

the system provides an intent and confidence level.

---

### 2. Uncertainty is a valid state

The model does not need to force every conversation into a confident category.

```text
PURCHASE
INFORMATIONAL
UNCERTAIN
```

`UNCERTAIN` allows ambiguous conversations to be handled safely.

---

### 3. Human review instead of blocking

When the model is uncertain, the system creates a provisional decision and sends the case for review rather than stopping the attribution process.

---

### 4. Auditability

The prototype keeps track of model and human decisions so that the final outcome can be understood.

---

# 14. Current Scope

This project is intentionally implemented as a **proof of concept**.

The prototype demonstrates:

* Customer intent classification
* Confidence scoring
* Automatic decisions
* Provisional decisions
* Human review
* Decision history
* REST API integration
* Frontend/backend communication
* Deployed workflow

It is designed to demonstrate the proposed architecture and workflow rather than represent a complete production system.

---

# 15. Production Extensions

A production implementation could extend this prototype with:

### Real Conversation Sources

Integrate with:

* Instagram Messaging APIs
* Shopify
* CRM systems
* Customer support platforms

### Advanced NLP / ML

Replace the prototype classification logic with a trained or LLM-based model using:

* Transformer models
* Embeddings
* LLM classification
* Conversation-level features
* Intent classification models

### Persistent Storage

Store conversations and decisions in a database such as:

* PostgreSQL
* MySQL

This would allow long-term history and analytics.

### Reviewer Dashboard

A production review interface could provide:

* Review queues
* Priority levels
* Reviewer assignment
* Model explanation
* Conversation history
* Final attribution status

### Feedback Loop

Human decisions could be collected as labeled data and used to improve the classifier over time.

```text
Model Prediction
       ↓
Human Review
       ↓
Corrected Label
       ↓
Training Data
       ↓
Improved Model
```

### Monitoring

Production deployment could additionally monitor:

* Classification accuracy
* Confidence calibration
* False purchase attribution
* Review rates
* Model drift
* Human override rates

---

# 16. Limitations of the Prototype

This is a demonstration prototype and therefore has several limitations.

* It does not connect directly to Instagram or Shopify.
* The classification layer is simplified for demonstration purposes.
* It does not use a production-scale database.
* Review history is maintained in the frontend during the current session.
* Confidence thresholds are prototype-level rather than production-calibrated.
* Authentication and authorization are not implemented.
* The prototype does not represent production-level model monitoring or observability.

These components would be addressed in a production implementation.

---

# 17. Why This Approach?

The objective of SentLogic is not simply to classify customer messages.

The larger goal is to build an attribution workflow that is:

**Confidence-aware**

The system knows when it is uncertain.

**Non-blocking**

Uncertainty does not stop the overall attribution workflow.

**Human-assisted**

Humans can resolve ambiguous cases.

**Auditable**

Model and human decisions can be tracked.

**Extensible**

The prototype can evolve into a production system with real messaging integrations, databases, advanced NLP models, and reviewer workflows.

---

# 18. Summary

SentLogic demonstrates a simple but important idea:

> **Customer interest should not automatically be treated as purchase intent.**

By combining:

```text
Conversation Analysis
        +
Intent Classification
        +
Confidence Scoring
        +
Provisional Decisions
        +
Human Review
        +
Decision History
```

the system provides a foundation for more reliable customer attribution.

This prototype serves as a practical demonstration of the proposed **confidence-aware, human-in-the-loop attribution architecture**.

---

## Author

**Nithyaveni Ramesh**


