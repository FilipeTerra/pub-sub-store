const RabbitMQService = require('./rabbitmq-service.js')
const path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '.env') })

var report = {}
async function updateReport(products) {
    for(let product of products) {
        if(!product.name) {
            continue
        } else if(!report[product.name]) {
            report[product.name] = 1;
        } else {
            report[product.name]++;
        }
    }
}

async function printReport() {
    console.log("--- Relatório de Vendas Atualizado ---");
    if (Object.keys(report).length === 0) {
        console.log("Nenhum produto vendido ainda.");
    } else {
        for (const [key, value] of Object.entries(report)) {
            console.log(`- ${key}: ${value} venda(s)`);
        }
    }
    console.log("--------------------------------------");
}

async function processMessage(msg) {
    try {
        console.log("Nova mensagem de relatório recebida...");
        const orderData = JSON.parse(msg.content);
        
        await updateReport(orderData.products);
        await printReport();

    } catch (error) {
        console.error("Erro ao processar mensagem:", error);
    }
}

async function consume() {
    console.log(`Iniciando consumidor para a fila: ${process.env.RABBITMQ_QUEUE_NAME}`)
    await (await RabbitMQService.getInstance()).consume(
        process.env.RABBITMQ_QUEUE_NAME, 
        (msg) => { processMessage(msg) }
    )
}

consume()
