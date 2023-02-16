const fs = require('fs');
const request = require('supertest');

const app = require('../src/app');
const animalData = require('../src/data/animals.json');

describe('Inserção de Animal', () => {
    afterAll( () => {
        while (animalData.length > 0){
            animalData.pop();
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalData));
    });
    it('deve cadastrar um animal com sucesso', async () =>{
        const res = await request(app).post('/animais?nome=Spike&especie=Cachorro&idade=3');
        expect(res.status).toBe(201);
    });

    it('deve retorna um erro no cadastro pois idade tem que ser numero', async () =>{
        const res = await request(app).post('/animais?nome=Mimi&especie=Gato&idade=jovem');
        expect(res.status).toBe(400);
    });
    it('deve retorna um erro no cadastro pois o nome deve ser maior que 2 caracters', async () =>{
        const res = await request(app).post('/animais?nome=j&especie=hamster&idade=1');
        expect(res.status).toBe(400);
    });
}); 

describe("Retorna uma lista de animais", () => {
    beforeAll(() => {
        animalData.push({
            'id': 'idtest',
            'nome': 'Mimi',
            'especie': 'gato',
            'idade': 2
        });
        animalData.push({
            'id': 'idtest',
            'nome': 'Spike',
            'especie': 'cachorro',
            'idade': 3
        });
        animalData.push({
            'id': 'idtest',
            'nome': 'joao',
            'especie': 'hamster',
            'idade': 1
        });
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalData));
    });

    afterAll( () => {
        while (animalData.length > 0){
            animalData.pop();
        }
        fs.writeFileSync('src/data/animals.json', JSON.stringify(animalData));
    });

    it('Deve retorna uma lista de animais', async () => {
        const res = await request(app).get('/animais');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(3);
    })
});