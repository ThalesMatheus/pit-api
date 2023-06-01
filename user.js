import { db } from "../db.js";
import {hash, compare} from 'bcrypt'
//import Up from "./Up.js";

export const getUser = (req, res) => {
  const q = "SELECT * FROM usuarios where `email` = ? && `senha` = ?";

  const values = [
    req.body.email,
    req.body.senha,
  ];

  db.query(q, [values],(err, data) => {
    //if (err) 
      //{return res.status(200).json(err.message)}

    if (data == undefined) {
      return res.status(200).json(values[req.body.email]+"Errado");
    }
    else {
      return res.status(200).json("Certo")
    }
  });
};

export const addUser = (req, res) => {
  var peido = req.body.peido
  
  if (peido == 0) {
    hash(req.body.senha,10, (err,hash) => {
  const q =
    "INSERT INTO usuarios(`email`, `senha`) VALUES(?,?)";
  db.query(q, [req.body.email,hash], (err) => {
    if (err) return res.status(200).json("Esse email já foi usado");

    return res.status(200).json("Usuário criado com sucesso.");
  })
})}
  else if (peido == 1) {
    const q = 
      "SELECT * FROM usuarios where `email` = "+"\""+req.body.email+"\"";
      //console.log(q)
      db.query(q,(err, data) => {
    //if (err) 
      //{return res.status(200).json(err.message)}
        //console.log(data)
    if (data.length == 0) {
      return res.status(200).json("Email não encontrado no sistema");
    }
    else {
      compare(req.body.senha, data[0].senha, (error, response) => {
        if (response) {
          return [res.status(200).json("Certo")]
        }
        else res.status(200).json("Errado")
      })
    }
  });
  }
};

export const updateUser = (req, res) => {
  console.log(req.body.email_old)
  const q = "SELECT * FROM usuarios where `email` = "+"\""+req.body.email_old+"\"";
      //console.log(q)
      db.query(q,(err, data) => {
    //if (err) 
      //{return res.status(200).json(err.message)}
        //console.log(data)
    if (data.length == 0) {
      return res.status(200).json("Email não encontrado no sistema");
    }
    else {
      compare(req.body.senha_old, data[0].senha, (error, response) => {
        if (response) {
          hash(req.body.senha,10, (err,hash) => {
          db.query("UPDATE usuarios SET email = ?, senha = ? WHERE email = ?",[req.body.email,hash,req.body.email_old])
          return [res.status(200).json("Atualizado com sucesso")]
          })
        }
        else res.status(200).json("Errado buceta")
      })
    }
  });
  }

export const deleteUser = (req, res) => {
  const q = "DELETE FROM usuarios WHERE `email` = ? && `senha` = ?";

  const values = [
    req.body.email,
    req.body.senha,
  ]

  db.query(q, [values], (err) => {
    if (err) return res.json(err);
    return res.status(200).json("Usuário deletado com sucesso.");
  });
};