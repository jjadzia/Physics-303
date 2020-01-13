const questions = [
  {
    question: "W jakich jednostkach może być podany moduł Younga?",
    answers: [
      { id: "1", text: "N" },
      { id: "2", text: "GPa", correct: true },
      { id: "3", text: "m" },
      { id: "4", text: "kg" }
    ]
  },
  {
    question: "Czy prawo Hook'a jest oglónym prawem fizycznym?",
    answers: [
      { id: "1", text: "Tak" },
      { id: "2", text: "Nie", correct: true }
    ]
  },
  {
    question: "Kiedy wydłużenie metalowego druta jest wprost proporcjonalne do przyłożonej siły (prawo Hook'a)?",
    answers: [
      { id: "1", text: "Dla pewnego zakresu", correct: true },
      { id: "4", text: "Zawsze" },
      { id: "2", text: "Dla dużych sił" },
      { id: "3", text: "Dla małych sił" },
    ]
  },
  {
    question: "Co się stało/dzieje się z metalowym drutem, jeśli jeśli wcześniej przekroczono granicę sprężystości o niewielką wartość?",
    answers: [
      { id: "1", text: "Drut pęknął" },
      { id: "2", text: "Drut powrcił do pierotnej długości" },
      { id: "3", text: "Drut uległ nieodwracalnemu odkształceniu", correct: true },
      { id: "4", text: "Dla bardzo powoli zacznie wracać do pierotnej długości" },
    ]
  },
  {
    question: "Co to jest wydłużenie względne?",
    answers: [
      { id: "1", text: "Przyrost długości" },
      { id: "2", text: "Stosunek przyrostu długości do całkowitej długości", correct: true },
      { id: "3", text: "Stosunek przyrostu długości do przyłożonej siły" },
      { id: "4", text: "Stosunek przyłożonej siły do przyrostu długośc"}
    ]
  }
];

export default questions;
