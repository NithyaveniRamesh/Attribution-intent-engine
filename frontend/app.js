const API_URL = "http://127.0.0.1:8000";

let currentResult = null;
let history = [];

async function analyzeConversation() {
  const conversation = document.getElementById("conversation").value.trim();

  if (!conversation) {
    alert("Please enter a customer conversation first.");
    return;
  }

  const button = document.getElementById("analyzeBtn");

  button.disabled = true;
  button.textContent = "Analyzing...";

  try {
    const response = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation: conversation,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const result = await response.json();

    currentResult = result;

    displayResult(result);
  } catch (error) {
    console.error(error);

    alert(
      "Could not connect to the SentLogic backend.\n\n" +
        "Make sure FastAPI is running on http://127.0.0.1:8000",
    );
  } finally {
    button.disabled = false;
    button.textContent = "Analyze Conversation";
  }
}

function displayResult(result) {
  const resultSection = document.getElementById("resultSection");

  resultSection.classList.remove("hidden");

  document.getElementById("intent").textContent = result.intent;

  document.getElementById("confidence").textContent =
    `${Math.round(result.confidence * 100)}%`;

  document.getElementById("status").textContent = result.status;

  document.getElementById("confidenceText").textContent =
    `${Math.round(result.confidence * 100)}%`;

  document.getElementById("confidenceFill").style.width =
    `${result.confidence * 100}%`;

  document.getElementById("reason").textContent = result.reason;

  /*
   * Show human review section only when
   * the model is uncertain.
   */

  const reviewBox = document.getElementById("reviewBox");

  if (result.review_required) {
    reviewBox.classList.remove("hidden");

    document.getElementById("reviewIntent").textContent = result.intent;

    document.getElementById("reviewConfidence").textContent =
      `${Math.round(result.confidence * 100)}%`;
  } else {
    reviewBox.classList.add("hidden");
  }

  

  /*
   * Automatically show the review queue
   * for provisional decisions.
   */

  const reviewSection = document.getElementById("reviewSection");

  if (result.review_required) {
    reviewSection.classList.remove("hidden");
  } else {
    reviewSection.classList.add("hidden");
  }

  /*
   * Update result styling based on status.
   */

  const statusElement = document.getElementById("status");

  if (result.status === "AUTOMATIC") {
    statusElement.style.color = "#047857";
  } else {
    statusElement.style.color = "#c2410c";
  }
}

function sendToReview() {
  const reviewSection = document.getElementById("reviewSection");

  reviewSection.classList.remove("hidden");

  reviewSection.scrollIntoView({
    behavior: "smooth",
  });
}

function makeHumanDecision(decision) {
  if (!currentResult) {
    return;
  }

  /*
   * Append the model decision.
   */

  history.push({
    type: "Model Decision",
    decision: currentResult.intent,
    confidence: Math.round(currentResult.confidence * 100),
  });

  /*
   * Append the human decision separately.
   * We intentionally DO NOT overwrite the model decision.
   */

  history.push({
    type: "Human Decision",
    decision: decision,
    confidence: null,
  });

  renderHistory();

  /*
   * Update the review queue to show that
   * a human has completed the review.
   */

  const reviewSection = document.getElementById("reviewSection");

  reviewSection.innerHTML = `
        <div class="section-title">
            <div>
                <h2>Human Review Queue</h2>
                <p>Review completed</p>
            </div>
        </div>

        <div class="review-card">

            <div class="review-header">
                <strong>Conversation #1042</strong>
                <span class="provisional">REVIEWED</span>
            </div>

            <p style="margin-bottom: 10px;">
                Human reviewer selected:
            </p>

            <strong>${decision}</strong>

        </div>
    `;
}

function renderHistory() {
  const historySection = document.getElementById("historySection");

  const historyContainer = document.getElementById("history");

  historySection.classList.remove("hidden");

  historyContainer.innerHTML = "";

  history.forEach((item, index) => {
    const div = document.createElement("div");

    div.className = "history-item";

    let details = item.decision;

    if (item.confidence !== null) {
      details += ` — ${item.confidence}% confidence`;
    }

    div.innerHTML = `
            <strong>${index + 1}. ${item.type}</strong>
            <p>${details}</p>
        `;

    historyContainer.appendChild(div);
  });

  historySection.scrollIntoView({
    behavior: "smooth",
  });
}
