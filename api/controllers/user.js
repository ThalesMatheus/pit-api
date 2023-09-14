import { db } from '../db.js'
import { hash, compare } from 'bcrypt'
import { response } from 'express'
import jwt from 'jsonwebtoken'
import { v5 as uuidv5, v4 as uuidv4 } from 'uuid'
import nodemailer from 'nodemailer'
import md5 from 'blueimp-md5'

export const getUser = (req, res) => {
  const q = 'SELECT * FROM login where `email` = ? && `senha` = ?'

  const values = [req.body.email, req.body.senha]

  db.query(q, [values], (err, data) => {
    // if (err)
    // {return res.status(200).json(err.message)}

    if (data == undefined) {
      return res.status(200).json(values[req.body.email] + 'Errado')
    } else {
      return res.status(200).json('Certo')
    }
  })
}
function trigger (idtext, messagetext) {
  const response = { id: idtext, message: `${messagetext}` }
  res.status(200).json(response)
}
export const createGroup = (req, res) => {
  console.log(req)
  const keysWithNullValues = Object.keys(req.body).filter(key => req.body[key] === '');
  const keysString = keysWithNullValues.join(', ');
  console.log(keysWithNullValues)
if (keysWithNullValues.length > 0) {
  console.log('im here')
  const response = { id: 2, message: `há campos em branco. Preencha-os e tente novamente: ${keysString} ` };
  res.status(200).json(response);
} else {
  if (req.files) {
    const file = req.files.photo
    const fileExtension = file.name.split('.').pop()
    const uploadPath = './uploads/' + filename // Specify the path to save the file

    file.mv(uploadPath)
  }

  const tmp = 'SELECT * FROM grupo WHERE `grupoId` = ?';
  db.query(tmp, [req.body.grouplink], (error, result) => {
    if (error) {
      console.error('Error checking if group exists:', error);
      res.status(500).json({ error: 'Error checking if group exists' });
    } else {
      if (result.length !== 0) {
        const response = { id: 2, message: 'A group with this ID already exists!' };
        res.status(200).json(response);
      } else {
        const crud = 'INSERT INTO grupo(`grupoId`,`nome`,`foto`,`descricao`, `cnpj`,`cep`,`categorias`,`visibilidade`) VALUES(?,?,?,?,?,?,?,?)';
        var privado_ = req.body.c77 == "on" ? 1 : 0;
        db.query(crud, [req.body.grouplink ? req.body.grouplink : uuidv4, req.body.nome, req.body.image ? 'teste.png' : 'none', req.body.description, req.body.cnpj, req.body.endereco, 'esporte', privado_], (error, result) => {
          if (error) {
            console.error('Error creating group:', error);
            res.status(500).json({ error: 'Error creating group' });
          } else {
            const createdGroup = {
              id: result.insertId,
              name: req.body.nome,
              // Add more properties as needed
            };
            res.status(201).json(createdGroup);
          }
        });
      }
    }
  });
}}
export const getAllGroups = (req, res) => {
  const crud = 'SELECT * FROM grupo where visibilidade = 1';
  db.query(crud, (error, results) => {
    if (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Error fetching groups' });
    } else {
      console.log(results)
      res.status(200).json(results);
    }
  });
};
export const deleteGroup = (req, res) => {
  console.log(req.body)
  const q = 'DELETE FROM grupo WHERE `grupoId` = ?'
  db.query(q, [req.body.grupoId], (err, response) => {
    if (err){
      return res.status(200).json(err)
    }
    else {
      const block = {
        id: 1,
        message: 'grupo deletado com sucesso'
      }
      return res.status(200).json(block)
    }
  })

}
export const addUser = (req, res) => {
  try {
   
  
  // console.log(req.data);
  const peido = req.body.peido
  const id = uuidv4()
  // console.log(req.body.email);
  // console.log(id);
  const temp = 'SELECT email FROM login WHERE `email` = ?'
  db.query(temp, [req.body.email], (err, response) => {
    if ( response.length !== 0 ) {
      return res.status(200).json({
        id: 1,
        message: 'Esse email já foi usado'
      })
    } else {
      hash(req.body.senha, 10, (err, hash) => {
        const q = 'INSERT INTO login(`uuid`, `email`, `senha`) VALUES(?,?,?)'
        db.query(q, [id, req.body.email, hash], (err) => {
          console.log(err)
          if (err) {
          } else {
            const x =
              'INSERT INTO user_data(`nome`, `sobrenome`,`cep`, `telefone`, `apelido`, `uuid_fk`) VALUES(?,?,?,?,?,?)'
            db.query(x, [
              req.body.nome,
              req.body.sobrenome,
              req.body.endereco,
              req.body.telefone,
              req.body.nick,
              id
            ])
            const response = { id: 2, message: 'Usuario criado com sucesso' }
            return res.status(200).json(response)
          }
        })
      })
    }
  })
}
catch(error) {
  console.log(error)
}
}

export const auth_check = (req, res) => {
  const q = 'SELECT * FROM login where `email` = ?'
  db.query(q, [req.body.email], (err, response) => {
    const uuid = response[0].uuid
    console.log(uuid)
    res.json(uuid)
  })
}
export const validaCookie = (req, res) => {
  const secret = process.env.SECRET
  jwt.verify(req.body.token, secret, (err, user) => {
    if (err) {
      console.log(err)
      res.status(200).json(false)
    } else {
      res.status(200).json(true)
    }
  })
}
export const autUser = (req, res) => {
  const q = 'SELECT * FROM login where `email` = ' + '"' + req.body.email + '"'
  console.log(q)
  db.query(q, (err, data) => {
    // if (err)
    // {return res.status(200).json(err.message)}
    console.log(data)
    if (data.length == 0) {
      return res.status(200).json('Email não encontrado no sistema')
    } else {
      compare(req.body.senha, data[0].senha, (error, response) => {
        if (response) {
          const x = data[0].uuid
          console.log(x)
          const temptoken = process.env.SECRET
          const token = jwt.sign({ id: x }, temptoken, { expiresIn: '1h' })

          const response = {
            message: 'Certo',
            token
          }
          const a = res.status(200).json(response)
          return a
        } else {
          const response = {
            message: 'Errado'
          }
          res.status(200).json('Errado')
        }
      })
    }
  })
}

export const updateUser = (req, res) => {
  const q = 'UPDATE login SET `email` = ?, `senha` = ? WHERE `email` '

  const values = [req.body.email, req.body.senha]

  db.query(q, [...values, req.body.email], (err) => {
    if (err) return res.json(err)

    return res.status(200).json('Usuário atualizado com sucesso.')
  })
}

export const deleteUser = (req, res) => {
  const q = 'DELETE FROM login WHERE `uuid` = ?'

  db.query(q, [req.params.id], (err) => {
    if (err) return res.json(err)

    return res.status(200).json('Usuário deletado com sucesso.')
  })
}
export const updateImage = (req, res) => {
  console.log(req)
  if (req.files) {
    console.log(req.body.uuid)
    const file = req.files.photo
    const fileExtension = file.name.split('.').pop()
    const filename = `${Math.floor(Math.random() * 1000) + 1}.${fileExtension}` // Generate a unique filename
    const uploadPath = './uploads/' + filename // Specify the path to save the file

    file.mv(uploadPath, function (err) {
      if (err) {
        res
          .status(200)
          .json('falha ao fazer upload! Tente novamente mais tarde')
      } else {
        res.status(200).json('Perfil atualizado')
        const q = 'UPDATE user_data SET foto = ? WHERE uuid_fk = ?'
        db.query(q, [filename, req.body.uuid], (err) => {
          if (err) {
            console.log(err)
          }
        })
      }
    })
  } else {
    res.status(400).json({ error: 'No file uploaded' })
  }
}

export const forgotPass = (req, res) => {
  var new_pass = md5(Date.now());

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "joao.ns.silvajp@gmail.com",
      pass: process.env.NODEMAI,
    },
  });

  transport
    .sendMail({
      from: "Joao-Pedro-PIT <joao.ns.silvajp@gmail.com>",
      to: req.body.email,
      subject: "Enviando email com Nodemailer",
      html: `<h1>Olá, rei do capa!</hl> <p>Sua nova senha é: ${new_pass}</p>`,
      text: `Olá, rei do capa! Sua nova senha é: ${new_pass}`,
    })
    .then(() => {
      hash(new_pass, 10, (err, hash) => {
      const q = 'UPDATE login SET senha = ? WHERE `email` = ?'

      db.query(q, [hash,req.body.email], (err) => {
        if (err) return res.json(err)
    
        return res.status(200).json('Caso exista um email registrado no sistema, cheque sua caixa de entrada')
      })
    })
})
    .catch(err => console.log("Erro ao enviar email: ", err));
}
export const  group_entry = (req, res) => {
  //const sexo = validaCookie(req, res);
  console.log(req.body)
  const check = 'SELECT * FROM grupo_has_usuario WHERE `uuid` = ?'
  const a = JSON.parse(atob(req.body.uuid.split('.')[1])).id;

  db.query(check, [a], (err, response) => {
    if (err) console.log(err)
    if (response.length === 0) {
      const q = 'INSERT INTO grupo_has_usuario(`grupoId`, `uuid`) VALUES(?, ?)'
      db.query(q, [req.body.groupid, a], (err, response) => {
        if (err) {
          console.log(err)
          return res.status(304).json(err)
        }
        else {
          return res.status(200).json({id: 2, message: 'Entrou no grupo'})
        }
      })
    }
    else{
      return res.status(200).json({id:1,message:'Você já está participando deste grupo!'})
    }
  })
}

export const  group_leave = (req, res) => {
  //const sexo = validaCookie(req, res);
  console.log(req.body)
  const check = 'SELECT * FROM grupo_has_usuario WHERE `uuid` = ?'
  const a = JSON.parse(atob(req.body.uuid.split('.')[1])).id;

  db.query(check, [a], (err, response) => {
    if (err) console.log(err)
    if (response.length !== 0) {
      const q = 'delete from grupo_has_usuario where `grupoId` = ? && `uuid` =?'
      db.query(q, [req.body.groupid, a], (err, response) => {
        if (err) {
          console.log(err)
          return res.status(304).json(err)
        }
        else {
          return res.status(200).json({id: 2, message: 'Saiu do grupo'})
        }
      })
    }
    else{
      return res.status(200).json({di:1,message:'Você não está participando deste grupo!'})
    }
  })
}

export const current_users = (req, res) => {
const query = 'SELECT * FROM grupo_has_usuario INNER JOIN user_data ON user_data.uuid_fk = grupo_has_usuario.uuid WHERE grupo_has_usuario.grupoId = ?';
//SELECT user_data.nome FROM grupo_has_usuario INNER JOIN user_data ON user_data.uuid_fk = grupo_has_usuario.uuid WHERE grupo_has_usuario.grupoId = 'sexo';
db.query(query, [req.body.groupid.groupid], (err, response) => {
  console.log(response)
  return res.status(200).json(response);
})
}