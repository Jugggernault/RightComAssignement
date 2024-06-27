function add_entry_on_click(entry) {
    let btn = entry.target.getAttribute('data-value');
    let expression = document.getElementById('expression');
    let operators = ['-', '+', '/', '*', 'DEL', '.', 'x'];
    if (btn == 'DEL') {
        delete_last();
        return
    }

    if (operators.includes(btn) && (operators.includes(expression.value.charAt(expression.value.length - 1)))) {
        console.log(expression.value.charAt(expression.value.length - 1))
        return
    }

    expression.value += btn;
}

// select all the buttons
let buttons = document.querySelectorAll('.btn')

buttons.forEach(btn => {
    btn.addEventListener('click', add_entry_on_click);
    btn.addEventListener('click', function(event) {
        event.target.classList.add('scale-animation');

        setTimeout(function() {
            event.target.classList.remove('scale-animation');
        }, 100); 
    });

})




document.addEventListener('keydown', add_entry_on_keypress);
document.getElementById('reset').addEventListener('click', clear)
document.getElementById('result-button').addEventListener('click', calculate)

function add_entry_on_keypress(event) {
    let operators = ['-', '+', '/', '*']
    let keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '+', '*', '/'];
    if (keys.includes(event.key)) {
        expression = document.getElementById('expression');
        if (operators.includes(expression.value.charAt(expression.value.length - 1)) && operators.includes(event.key)) {
            return
        } else {
            expression.value += event.key
        }
    }
}

function clear() {
    document.getElementById("expression").value = ""
}
function delete_last() {
    let expression = document.getElementById("expression");
    expression.value = expression.value.slice(0, -1);
}

function calculate() {
    let expression = document.getElementById('expression')
    let lastChar = expression.value.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        return;
    }

    let tokens = expression.value.match(/(\d+\.?\d*|\.\d+|[-+*/])/g);
    if (!tokens) {
        throw new Error("Invalid expression");
    }

    let operators = [];
    let operands = [];

    // Priorité des opérateurs
    let precedence = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2
    };

    // Fonction pour appliquer un opérateur aux deux derniers opérandes
    function apply_operator() {
        let operator = operators.pop();
        let b = operands.pop();
        let a = operands.pop();
        switch (operator) {
            case '+': operands.push(a + b); break;
            case '-': operands.push(a - b); break;
            case '*': operands.push(a * b); break;
            case '/': operands.push(a / b); break;
        }
    }

    for (let token of tokens) {
        if (!isNaN(token)) {
            // Si le token est un nombre, le convertir en nombre et le pousser dans la pile des opérandes
            operands.push(parseFloat(token));
        } else if (token in precedence) {
            // Si le token est un opérateur
            while (operators.length > 0 && precedence[operators[operators.length - 1]] >= precedence[token]) {
                apply_operator();
            }
            operators.push(token);
        }
    }

    // Appliquer les opérateurs restants
    while (operators.length > 0) {
        apply_operator();
    }

    expression.value = operands[0];
}

function change_theme(event) {
    let toggleButtons = document.querySelectorAll('.tgl');
    toggleButtons.forEach(button => {
        button.classList.remove('selected');
    });

    let theme = event.target.getAttribute('data-theme');
    document.querySelector('.main').setAttribute('data-theme', theme)
    event.target.classList.add('selected');

}

let toggles = document.querySelectorAll('.tgl')
toggles.forEach(tgl => tgl.addEventListener('click', change_theme))



