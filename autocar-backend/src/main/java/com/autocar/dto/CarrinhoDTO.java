package com.autocar.dto;

import com.autocar.model.Carrinho;
import com.autocar.model.CarrinhoItem;
import com.autocar.model.Produto;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public class CarrinhoDTO {

    private Long id;
    private List<ItemDTO> itens;
    private BigDecimal total;
    private int quantidadeTotal;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public List<ItemDTO> getItens() { return itens; }
    public void setItens(List<ItemDTO> itens) { this.itens = itens; }
    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public int getQuantidadeTotal() { return quantidadeTotal; }
    public void setQuantidadeTotal(int q) { this.quantidadeTotal = q; }

    public static class ItemDTO {
        private Long id;
        private ProdutoDTO produto;
        private Integer quantidade;
        private BigDecimal subtotal;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public ProdutoDTO getProduto() { return produto; }
        public void setProduto(ProdutoDTO p) { this.produto = p; }
        public Integer getQuantidade() { return quantidade; }
        public void setQuantidade(Integer q) { this.quantidade = q; }
        public BigDecimal getSubtotal() { return subtotal; }
        public void setSubtotal(BigDecimal s) { this.subtotal = s; }
    }

    public static class ProdutoDTO {
        private Long id;
        private String nome;
        private String marca;
        private String modelo;
        private BigDecimal preco;
        private String imagemUrl;
        private String anoCompativel;
        private Integer estoque;
        private CategoriaDTO categoria;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String n) { this.nome = n; }
        public String getMarca() { return marca; }
        public void setMarca(String m) { this.marca = m; }
        public String getModelo() { return modelo; }
        public void setModelo(String m) { this.modelo = m; }
        public BigDecimal getPreco() { return preco; }
        public void setPreco(BigDecimal p) { this.preco = p; }
        public String getImagemUrl() { return imagemUrl; }
        public void setImagemUrl(String i) { this.imagemUrl = i; }
        public String getAnoCompativel() { return anoCompativel; }
        public void setAnoCompativel(String a) { this.anoCompativel = a; }
        public Integer getEstoque() { return estoque; }
        public void setEstoque(Integer e) { this.estoque = e; }
        public CategoriaDTO getCategoria() { return categoria; }
        public void setCategoria(CategoriaDTO c) { this.categoria = c; }
    }

    public static class CategoriaDTO {
        private Long id;
        private String nome;
        private String slug;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getNome() { return nome; }
        public void setNome(String n) { this.nome = n; }
        public String getSlug() { return slug; }
        public void setSlug(String s) { this.slug = s; }
    }

    public static CarrinhoDTO from(Carrinho carrinho) {
        CarrinhoDTO dto = new CarrinhoDTO();
        dto.setId(carrinho.getId());
        List<ItemDTO> itens = carrinho.getItens().stream()
                .map(CarrinhoDTO::toItemDTO).collect(Collectors.toList());
        dto.setItens(itens);
        dto.setTotal(itens.stream().map(ItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        dto.setQuantidadeTotal(itens.stream().mapToInt(ItemDTO::getQuantidade).sum());
        return dto;
    }

    private static ItemDTO toItemDTO(CarrinhoItem item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setQuantidade(item.getQuantidade());
        dto.setProduto(toProdutoDTO(item.getProduto()));
        dto.setSubtotal(item.getProduto().getPreco()
                .multiply(BigDecimal.valueOf(item.getQuantidade())));
        return dto;
    }

    private static ProdutoDTO toProdutoDTO(Produto p) {
        ProdutoDTO dto = new ProdutoDTO();
        dto.setId(p.getId());
        dto.setNome(p.getNome());
        dto.setMarca(p.getMarca());
        dto.setModelo(p.getModelo());
        dto.setPreco(p.getPreco());
        dto.setImagemUrl(p.getImagemUrl());
        dto.setAnoCompativel(p.getAnoCompativel());
        dto.setEstoque(p.getEstoque());
        if (p.getCategoria() != null) {
            CategoriaDTO c = new CategoriaDTO();
            c.setId(p.getCategoria().getId());
            c.setNome(p.getCategoria().getNome());
            c.setSlug(p.getCategoria().getSlug());
            dto.setCategoria(c);
        }
        return dto;
    }
}