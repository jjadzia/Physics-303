const questions = [
  {
    question:
      "Dokonano serii pomiarów parametru dających zbliżone wyniki, jaką wartość najlepiej przyjąć za wynik pomiaru?",
    answers: [
      { id: "1", text: "Średnią arytmetyczną", correct: true },
      { id: "2", text: "Największy z pomiarów" },
      { id: "3", text: "Najmniejszy z pomiarów" },
      { id: "4", text: "Dowolną" }
    ]
  },
  {
    question: 'Wykonano 30 pomiarów parametru m, obliczono średnią, jak najlepiej oszacować niepewność?',
    answers: [
      { id: "1", text: "Ocenić błąd odczytywania wyników " },
      { id: "2", text: "Obliczyć odchylenie standardowe średniej", correct: true },
      { id: "3", text: "Przyjąć 1% z wyliczonej średniej" },
      { id: "4", text: "Żadną, taki pomiar jest bezwględnie dokładny" }
    ]
  },
  {
    question: 'Wykonano 3 pomiary parametru l, jak najlepiej oszacować niepewność?',
    answers: [
      { id: "2", text: "Obliczyć odchylenie standardowe średniej,"},
      { id: "3", text: "Przyjąć 1% z wyliczonej średniej" },
      { id: "4", text: "Żadną, taki pomiar jest bezwględnie dokładny" },
      { id: "1", text: "Ocenić błąd odczytywania wyników ", correct: true },
    ]
  },
  {
    question: 'Czy okres wahadła jest zależny od kąta wychylenia początkowego?',
    answers: [
      { id: "1", text: "Tak ", correct: true  },
      { id: "2", text: "Nie"},

    ]
  },
  {
    question: 'Przyjęty do obliczeń model wahadła matematycznego jest modelem:',
    answers: [
      { id: "2", text: "Teoretycznym", correct: true},
      { id: "3", text: "Fizycznym" },
      { id: "4", text: "Geometrycznym" },
      { id: "1", text: "Statystycznym" },
    ]
  },
];

export default questions;
