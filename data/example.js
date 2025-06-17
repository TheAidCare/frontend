
// Request API
{NEXT_PUBLIC_API_URL}/api/v1/patients/{patientID}/consultation/{consultationID}

// Example of a response from the server
{
  "success": true,
  "message": "Patient and consultation data retrieved successfully",
  "data": {
      "patient": {
          "_id": "68506e11029889c478f0cbdb",
          "firstName": "Ridwan",
          "lastName": "Adeyemo",
          "dateOfBirth": "1990-05-15T00:00:00.000Z",
          "gender": "male",
          "organization": "683abdf7afd3eef0a3062a8f",
          "isActive": true,
          "fullName": "Ridwan Adeyemo",
          "age": 35
      },
      "consultation": {
          "_id": "68510e995a7bde541ac15e01",
          "consultant": "683ac168afd3eef0a3062a98",
          "patient": "68506e11029889c478f0cbdb",
          "title": "New Consultation",
          "isActive": true,
          "createdAt": "2025-06-17T06:43:37.724Z",
          "updatedAt": "2025-06-17T06:58:43.462Z",
          "messages": [
              {
                  "_id": "68510e995a7bde541ac15e03",
                  "sender": "user",
                  "userMessage": "I have headache.",
                  "triageData": {
                      "triage_recommendation": {
                          "recommended_actions_for_chw": [],
                          "key_guideline_references": [],
                          "important_notes_for_chw": []
                      },
                      "extracted_symptoms": [],
                      "retrieved_guidelines_summary": []
                  },
                  "createdAt": "2025-06-17T06:43:37.942Z"
              },
              {
                  "_id": "68510eae5a7bde541ac15e06",
                  "sender": "system",
                  "triageData": {
                      "mode": "chw_triage_text",
                      "input_transcript": "I have headache.",
                      "extracted_symptoms": [
                          "headache"
                      ],
                      "retrieved_guidelines_summary": [
                          {
                              "source": "CHO Guidelines",
                              "code": "5.9",
                              "case": "Adult with headache",
                              "score": 0.7942992448806763,
                              "_id": "68510eae5a7bde541ac15e07"
                          },
                          {
                              "source": "CHEW Guidelines",
                              "code": "5.9",
                              "case": "Acute or chronic headache",
                              "score": 0.9419989585876465,
                              "_id": "68510eae5a7bde541ac15e08"
                          },
                          {
                              "source": "CHO Guidelines",
                              "code": "3.7",
                              "case": "Complaint of headache",
                              "score": 0.9740065336227417,
                              "_id": "68510eae5a7bde541ac15e09"
                          }
                      ],
                      "triage_recommendation": {
                          "summary_of_findings": "The patient presents with a headache.  Guideline entries 1 and 2 are most relevant, suggesting the headache could be a tension headache, migraine, or have a systemic cause.  Further information is needed to determine the severity and nature of the headache.",
                          "recommended_actions_for_chw": [
                              "1. Treat symptomatically.",
                              "2. Refer if headache is severe, chronic, or if neurologic signs are present."
                          ],
                          "urgency_level": "Refer to Clinic",
                          "key_guideline_references": [
                              "N/A - Code: 5.9, Case: Adult with headache",
                              "N/A - Code: 5.9, Case: Acute or chronic headache"
                          ],
                          "important_notes_for_chw": []
                      }
                  },
                  "createdAt": "2025-06-17T06:43:58.778Z"
              },
              {
                  "_id": "6851121e3160203b4785508a",
                  "sender": "user",
                  "userMessage": "I have headache.",
                  "triageData": {
                      "triage_recommendation": {
                          "recommended_actions_for_chw": [],
                          "key_guideline_references": [],
                          "important_notes_for_chw": []
                      },
                      "extracted_symptoms": [],
                      "retrieved_guidelines_summary": []
                  },
                  "createdAt": "2025-06-17T06:58:38.770Z"
              },
              {
                  "_id": "685112233160203b4785508d",
                  "sender": "system",
                  "triageData": {
                      "mode": "chw_triage_text",
                      "input_transcript": "I have headache.",
                      "extracted_symptoms": [
                          "headache"
                      ],
                      "retrieved_guidelines_summary": [
                          {
                              "source": "CHO Guidelines",
                              "code": "5.9",
                              "case": "Adult with headache",
                              "score": 0.7942992448806763,
                              "_id": "685112233160203b4785508e"
                          },
                          {
                              "source": "CHEW Guidelines",
                              "code": "5.9",
                              "case": "Acute or chronic headache",
                              "score": 0.9419989585876465,
                              "_id": "685112233160203b4785508f"
                          },
                          {
                              "source": "CHO Guidelines",
                              "code": "3.7",
                              "case": "Complaint of headache",
                              "score": 0.9740065336227417,
                              "_id": "685112233160203b47855090"
                          }
                      ],
                      "triage_recommendation": {
                          "summary_of_findings": "The patient presents with a headache.  Guideline entries 1 and 2 are most relevant, suggesting the headache could be a tension headache, migraine, or have a systemic cause.  Further information is needed to determine the severity and nature of the headache.",
                          "recommended_actions_for_chw": [
                              "1. Treat symptomatically.",
                              "2. Refer if headache is severe, chronic, or if neurologic signs are present."
                          ],
                          "urgency_level": "Refer to Clinic",
                          "key_guideline_references": [
                              "N/A - Code: 5.9, Case: Adult with headache",
                              "N/A - Code: 5.9, Case: Acute or chronic headache"
                          ],
                          "important_notes_for_chw": []
                      }
                  },
                  "createdAt": "2025-06-17T06:58:43.189Z"
              }
          ],
          "messageCount": 4
      }
  },
  "statusCode": 200
}