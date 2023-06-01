import { db } from "../db.js";
import { hash, compare } from 'bcrypt'
import { response } from "express";
import jwt from 'jsonwebtoken';
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid';
export const getUser = (req, res) => {
  const q = "SELECT * FROM login where `email` = ? && `senha` = ?";

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
  console.log(req.data)
  var peido = req.body.peido
  const id = uuidv4()
  console.log(req.body.email)
  console.log(id)
  const x = "INSERT INTO user_data(`nome`, `sobrenome`,`endereco`, `telefone`, `apelido`) VALUES(?,?,?,?,?)"
  db.query(x,[req.body.nome, req.body.sobrenome, req.body.endereco, req.body.telefone, req.body.nick], (error, response) => {
    if (response) {
      hash(req.body.senha, 10, (err, hash) => {
        const q =
          "INSERT INTO login(`uuid`, `email`, `senha`) VALUES(?,?,?)";
        db.query(q, [id, req.body.email, hash], (err) => {
          console.log(err)
          if (err) return res.status(200).json("Esse email já foi usado");
  
          return res.status(200).json("Usuário criado com sucesso.");
      })
      })
    }
    else {
      res.status(200).json(error)
      console.log(error)
    }
  })
    
  }

  export const auth_check = (req, res) => {
    const q = "SELECT * FROM login where `email` = ?"
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
      "SELECT * FROM login where `email` = " + "\"" + req.body.email + "\"";
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
      "UPDATE login SET `email` = ?, `senha` = ? WHERE `email` ";

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
    const q = "DELETE FROM login WHERE `id` = ?";

    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Usuário deletado com sucesso.");
    });

  };
  export const updateImage = (req, res) => {
    if (req.files) {
      console.log(req.body.uuid)
      const file = req.files.photo;
      const filename = `${Math.floor(Math.random() * 1000) + 1 }`; // Generate a unique filename
      const uploadPath = './uploads/' + filename; // Specify the path to save the file
  
      file.mv(uploadPath, function(err) {
        if (err) {
          res.status(200).json("falha ao fazer upload! Tente novamente mais tarde");
        } else {
          res.status(200).json("Perfil atualizado");
          var q = "UPDATE login SET pfp = ? WHERE uuid = ?"
          db.query(q,[filename, req.body.uuid], (err) => {
            if(err){
              console.log(err)
              return;
            }
          })
        }
      });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  };