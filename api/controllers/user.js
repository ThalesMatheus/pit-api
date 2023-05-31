import { db } from "../db.js";
import { hash, compare } from 'bcrypt'
import { response } from "express";
import jwt from 'jsonwebtoken';

import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
export const getUser = (req, res) => {
  const q = "SELECT * FROM usuarios where `email` = ? && `senha` = ?";

  const values = [
    req.body.email,
    req.body.senha,
  ];

  db.query(q, [values], (err, data) => {
    //if (err) 
    //{return res.status(200).json(err.message)}

    if (data == undefined) {
      return res.status(200).json(values[req.body.email] + "Errado");
    }
    else {
      return res.status(200).json("Certo")
    }
  });
};

export const addUser = (req, res) => {
  var peido = req.body.peido
  const id = uuidv4()
  console.log(id)
    hash(req.body.senha, 10, (err, hash) => {
      const q =
        "INSERT INTO usuarios(`uuid`, `email`, `senha`) VALUES(?,?,?)";
      db.query(q, [id, req.body.email, hash], (err) => {
        console.log(err)
        if (err) return res.status(200).json("Esse email já foi usado");

        return res.status(200).json("Usuário criado com sucesso.");
    })
    })
  }

  export const auth_check = (req, res) => {
    const q = "SELECT * FROM usuarios where `email` = ?"
    db.query(q, [req.body.email], (err, response) => {
      const uuid = response[0].uuid
      console.log(uuid)
      res.json(uuid)
    })
  }
  export const validaCookie = (req, res) => {
  var secret = process.env.SECRET
  jwt.verify(req.body.token, secret, (err, user)=>{
      if (err){
        console.log(err)
        res.status(200).json(false);
      }
      else {
      res.status(200).json(true)
  }})
  }
  export const autUser = (req, res) => {
    const q =
      "SELECT * FROM usuarios where `email` = " + "\"" + req.body.email + "\"";
    console.log(q)
    db.query(q, (err, data) => {
      //if (err) 
      //{return res.status(200).json(err.message)}
      console.log(data)
      if (data.length == 0) {
        return res.status(200).json("Email não encontrado no sistema");
      }
      else {
        
        compare(req.body.senha, data[0].senha, (error, response) => {
          if (response){
          const x = data[0].uuid
          console.log(x)
          var temptoken = process.env.SECRET
          const token = jwt.sign({ id: x }, temptoken, { expiresIn: '1h'})

          const response = {
            message: "Certo",
            token: token
            
          }
          const a = res.status(200).json(response);
            return a
        }
      
          else {
            const response = {
              message: "Errado"
            }
            res.status(200).json("Errado")}
        })
      }
    })
  };


  export const updateUser = (req, res) => {
    const q =
      "UPDATE usuarios SET `email` = ?, `senha` = ? WHERE `email` ";

    const values = [
      req.body.email,
      req.body.senha,
    ];

    db.query(q, [...values, req.body.email], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Usuário atualizado com sucesso.");
    });
  };

  export const deleteUser = (req, res) => {
    const q = "DELETE FROM usuarios WHERE `id` = ?";

    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Usuário deletado com sucesso.");
    });

  };
