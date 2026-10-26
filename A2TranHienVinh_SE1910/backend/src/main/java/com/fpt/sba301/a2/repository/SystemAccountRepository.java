package com.fpt.sba301.a2.repository;

import com.fpt.sba301.a2.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {
    Optional<SystemAccount> findByAccountEmail(String email);
    Optional<SystemAccount> findByAccountEmailAndAccountPassword(String email, String password);
    boolean existsByAccountEmail(String email);

    @Query("SELECT COALESCE(MAX(a.accountID), 0) FROM SystemAccount a")
    Short findMaxAccountId();

    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name, String email);
}
