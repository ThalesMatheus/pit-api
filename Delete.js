import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 0px 5px #ccc;
  border-radius: 5px;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 120px;
  padding: 0 10px;
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: #2c73d2;
  color: white;
  height: 42px;
`;

const Delete = ({ getUsers, onEdit, setOnEdit }) => {
    const ref = useRef();

    // useEffect(() => {
    //     if (onEdit) {
    //       const user = ref.current;
    
    //       user.nome.value = onEdit.nome;
    //       user.email.value = onEdit.email;
    //       user.fone.value = onEdit.fone;
    //       user.data_nascimento.value = onEdit.data_nascimento;
    //     }
    //   }, [onEdit]);

    const vas = async (e)=> {
        e.preventDefault();

        const user = ref.current

        if (
            !user.email.value ||
            !user.senha.value
          ) {
            return toast.warn("Preencha todos os campos!");
          }
        //   if (!onEdit) {
          await axios
          .delete("http://localhost:8800", {
          email: user.email.value,
          senha: user.senha.value,
      })
      .then(({ data }) => toast.success(data))
      .catch(({ data }) => toast.error(data));
    // }
        //alert(user.email.value)
        // setOnEdit(null);
        // getUsers();
    }
    return (
        <>
        <Label style={{fontWeight:"Bold",fontSize:30}}>Delete</Label>
        <FormContainer ref={ref} onSubmit={vas}>
            <InputArea>
                <Label>Email</Label>
                <Input name="email" type="email"></Input>
            </InputArea>
            <InputArea>
                <Label>Senha</Label>
                <Input name="senha" type="password"></Input>
            </InputArea>
            <Button type="submit">Delete</Button>
        </FormContainer>
        </>
    )
}
export default Delete;