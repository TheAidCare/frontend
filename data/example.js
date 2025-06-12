// Example of a sent message to the websocket

{
  "message": "Patient Info:  Name: Mama Ijeoma Age: Estimated 68 Sex: Female Location: Ekwulobia, Anambra Marital Status: Widow Occupation: Retired trader Medical History: Known hypertensive, on medication irregularly (uses herbal mixtures in between) Family History: Sister died of stroke at 60 Social History: Lives alone, supported by children who live in the city Housing: Lives in a bungalow, uses well water and firewood for cooking Diet: Mostly yam, garri, okro soup. Rarely eats meat or fruits  Presenting Complaints:  Gradual worsening of pain in both knees over the past 6 months, now affecting ability to walk long distances. Complains of morning stiffness in joints that eases slightly after movement. Occasional swelling of ankles, especially in the evenings. Recently started feeling slight numbness in fingers. Reports one episode of dizziness last week while trying to stand up from bed. Sometimes forgets to take her BP medication, especially when she “feels okay.” No chest pain or palpitations. Reports difficulty sleeping due to pain at night. No fall or trauma, but uses a walking stick to support herself now."
}


// Example of first received message from the websocket on that sent message

{
  "content": "Patient Info:  Name: Mama Ijeoma Age: Estimated 68 Sex: Female Location: Ekwulobia, Anambra Marital Status: Widow Occupation: Retired trader Medical History: Known hypertensive, on medication irregularly (uses herbal mixtures in between) Family History: Sister died of stroke at 60 Social History: Lives alone, supported by children who live in the city Housing: Lives in a bungalow, uses well water and firewood for cooking Diet: Mostly yam, garri, okro soup. Rarely eats meat or fruits  Presenting Complaints:  Gradual worsening of pain in both knees over the past 6 months, now affecting ability to walk long distances. Complains of morning stiffness in joints that eases slightly after movement. Occasional swelling of ankles, especially in the evenings. Recently started feeling slight numbness in fingers. Reports one episode of dizziness last week while trying to stand up from bed. Sometimes forgets to take her BP medication, especially when she “feels okay.” No chest pain or palpitations. Reports difficulty sleeping due to pain at night. No fall or trauma, but uses a walking stick to support herself now.",
  "sender": "user",
  "consultationId": "684a196fce76826035a86779",
  "triageData": {
      "triage_recommendation": {
          "recommended_actions_for_chw": [],
          "key_guideline_references": [],
          "important_notes_for_chw": []
      },
      "extracted_symptoms": [],
      "retrieved_guidelines_summary": []
  },
  "_id": "684a19a7ce76826035a86781",
  "timestamp": "2025-06-12T00:04:55.541Z",
  "createdAt": "2025-06-12T00:04:55.541Z",
  "updatedAt": "2025-06-12T00:04:55.541Z",
  "__v": 0
}

// Example of second & main received message from the websocket on that sent message

{
  "content": "The patient presents with gradual worsening bilateral knee pain, affecting mobility, morning stiffness, ankle swelling, and occasional dizziness.  Guideline Entry 1 (Musculo-Skeletal System Disorders) and Guideline Entry 2 (Pain or swelling in limbs) are most relevant, suggesting potential osteoarthritis, age-related degeneration, or arthritis.  The dizziness warrants further investigation.",
  "sender": "system",
  "consultationId": "684a196fce76826035a86779",
  "triageData": {
      "mode": "chw_triage_text_input",
      "input_transcript": "Patient Info:  Name: Mama Ijeoma Age: Estimated 68 Sex: Female Location: Ekwulobia, Anambra Marital Status: Widow Occupation: Retired trader Medical History: Known hypertensive, on medication irregularly (uses herbal mixtures in between) Family History: Sister died of stroke at 60 Social History: Lives alone, supported by children who live in the city Housing: Lives in a bungalow, uses well water and firewood for cooking Diet: Mostly yam, garri, okro soup. Rarely eats meat or fruits  Presenting Complaints:  Gradual worsening of pain in both knees over the past 6 months, now affecting ability to walk long distances. Complains of morning stiffness in joints that eases slightly after movement. Occasional swelling of ankles, especially in the evenings. Recently started feeling slight numbness in fingers. Reports one episode of dizziness last week while trying to stand up from bed. Sometimes forgets to take her BP medication, especially when she “feels okay.” No chest pain or palpitations. Reports difficulty sleeping due to pain at night. No fall or trauma, but uses a walking stick to support herself now.",
      "extracted_symptoms": [
          "gradual worsening of pain in both knees over the past 6 months, now affecting ability to walk long distances",
          "morning stiffness in joints that eases slightly after movement",
          "occasional swelling of ankles, especially in the evenings",
          "slight numbness in fingers",
          "one episode of dizziness last week while trying to stand up from bed",
          "difficulty sleeping due to pain at night"
      ],
      "retrieved_guidelines_summary": [
          {
              "source": "CHO Guidelines",
              "code": "7.1",
              "case": "Joint pain or reduced mobility",
              "score": 1.2347203493118286,
              "_id": "684a19aace76826035a86785"
          },
          {
              "source": "CHO Guidelines",
              "code": "5.27",
              "case": "Pain or swelling in limbs",
              "score": 1.2597465515136719,
              "_id": "684a19aace76826035a86786"
          },
          {
              "source": "CHO Guidelines",
              "code": "5.18",
              "case": "Pain, stiffness, or swelling in neck",
              "score": 1.33315908908844,
              "_id": "684a19aace76826035a86787"
          }
      ],
      "triage_recommendation": {
          "summary_of_findings": "The patient presents with gradual worsening bilateral knee pain, affecting mobility, morning stiffness, ankle swelling, and occasional dizziness.  Guideline Entry 1 (Musculo-Skeletal System Disorders) and Guideline Entry 2 (Pain or swelling in limbs) are most relevant, suggesting potential osteoarthritis, age-related degeneration, or arthritis.  The dizziness warrants further investigation.",
          "recommended_actions_for_chw": [
              "1. Prescribe analgesics.",
              "2. Encourage mobility.",
              "3. Refer for physiotherapy."
          ],
          "urgency_level": "Refer to Clinic",
          "key_guideline_references": [
              "N/A - Code: 7.1, Case: Joint pain or reduced mobility",
              "N/A - Code: 5.27, Case: Pain or swelling in limbs"
          ],
          "important_notes_for_chw": [
              "The dizziness reported requires further assessment by a clinician to rule out other causes.",
              "Monitor for worsening symptoms or new symptoms."
          ]
      }
  },
  "_id": "684a19aace76826035a86784",
  "timestamp": "2025-06-12T00:04:58.733Z",
  "createdAt": "2025-06-12T00:04:58.734Z",
  "updatedAt": "2025-06-12T00:04:58.734Z",
  "__v": 0
}