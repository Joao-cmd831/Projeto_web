package com.autocar.repository;

import com.autocar.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivoTrue();

    @Query("SELECT p FROM Produto p WHERE p.ativo = true AND " +
           "(LOWER(p.nome) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.marca) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           " LOWER(p.descricao) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Produto> buscar(@Param("q") String query);

    List<Produto> findByCategoriaIdAndAtivoTrue(Long categoriaId);
}
