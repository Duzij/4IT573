import test from 'ava'
import db from '../src/db.js';
import supertest from 'supertest'
import {app} from '../src/app.js';

test.beforeEach(async ()=>{
    await db.migrate.latest();
});

test.afterEach(async ()=>{
    await db.migrate.rollback();
})

test.serial('Get / return all todos', async (t)=>{
    await db('todos').insert({text:'test'});
    const response = await supertest(app).get("/");
    t.is(200, response.statusCode);
    t.assert(response.text.includes('test'))
});


test.serial('Post /add adds new todo', async (t)=>{
    await db('todos').insert({text:'test'});
    const response = await supertest(app).post("/add").type("form").send("test").redirects(1);
    t.is(200, response.statusCode);
    t.assert(response.text.includes('test'))
});

