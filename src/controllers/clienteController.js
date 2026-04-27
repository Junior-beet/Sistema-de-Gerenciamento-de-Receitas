import axios from "axios";
import { Cliente } from "../models/Cliente.js";
import { Endereco } from "../models/Endereco.js";
import { Telefone } from "../models/Telefone.js";
import clienteRepository from "../repositories/clienteRepositories.js";
import { validarCPF } from "../utils/validarCpf.js";
import { limparNumero } from "../utils/limparNumero.js";

const clienteController = {
    criar: async (req, res) => {
        try {
            const { nome, cpf, numero, cep, complemento } = req.body;

            if (!validarCPF(cpf)) {
                return res.status(400).json({ message: "CPF inválido" });
            }
            const numeroLimpo = limparNumero(numero);
            const dadosCep = await consultaCep(cep);
            const cliente = Cliente.criar({ nome, cpf });

            const telefone = Telefone.criar({
                numero: numeroLimpo
            });

            const endereco = Endereco.criar({
                cep,
                lougradouro: dadosCep.logradouro,
                bairro: dadosCep.bairro,
                cidade: dadosCep.localidade,
                uf: dadosCep.uf,
                numero,
                complemento
            });
            const result = await clienteRepository.criar(cliente, telefone, endereco);

            res.status(201).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor", errorMessage: error.message
            });
        }
    },

    atualizar: async (req, res) => {
        try {
            const id = Number(req.query.id);
            const { nome, cpf } = req.body;

            if (!validarCPF(cpf)) {
                return res.status(400).json({ message: "CPF inválido" });
            }

            const cliente = Cliente.editar({ nome, cpf }, id);
            const result = await clienteRepository.atualizar(cliente);

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    deletar: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const result = await clienteRepository.deletar(id);

            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    },

    selecionar: async (req, res) => {
        try {
            const result = await clienteRepository.selecionar();
            res.status(200).json({ result });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Ocorreu um erro no servidor",
                errorMessage: error.message
            });
        }
    }
};



export default clienteController;

async function consultaCep(cep) {
        try {
            const respApi = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            if (respApi.data.erro) {
                throw new Error('CEP não encontrado')
            }
            return respApi.data;
        } catch (error) {
            console.error(error)
            throw new Error("Erro ao buscar o CEP", error.message);
        }
    }