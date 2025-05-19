let Questions = [];
let timeLeft;
Questions.push(["W ktorej sali jest xammp?","sala 102","sala 104","sala 102b","sala 110","sala 102b"])
Questions.push(["Jakie jest imie prowadzącego bazen danen?","Michał","Urszula","Krzysztof","Michał Krzysiek","Urszula"])
Questions.push(["What is the capital of France?", "Berlin", "Madrid", "Paris", "Rome", "Paris"]);
Questions.push(["Which planet is known as the Red Planet?", "Earth", "Mars", "Jupiter", "Venus", "Mars"]);
Questions.push(["What is the largest mammal?", "Elephant", "Blue Whale", "Giraffe", "Shark", "Blue Whale"]);
Questions.push(["Who wrote 'Romeo and Juliet'?", "Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen", "William Shakespeare"]);
Questions.push(["What is the chemical symbol for water?", "H2O", "O2", "CO2", "HO", "H2O"]);
Questions.push(["Which country is known as the Land of the Rising Sun?", "China", "Japan", "Thailand", "India", "Japan"]);
Questions.push(["What is the square root of 64?", "6", "7", "8", "9", "8"]);
Questions.push(["Who painted the Mona Lisa?", "Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Claude Monet", "Leonardo da Vinci"]);
Questions.push(["What is the smallest prime number?", "0", "1", "2", "3", "2"]);
Questions.push(["Which ocean is the largest?", "Atlantic", "Indian", "Arctic", "Pacific", "Pacific"]);
let QuestionsCopy = Questions.slice(); // Create a copy of the original questions array

function getRandomQuestion() {
    let randomIndex = Math.floor(Math.random() * Questions.length);
    let question = Questions[randomIndex];
    Questions.splice(randomIndex, 1); // Remove the question from the original array    
    return question;
}