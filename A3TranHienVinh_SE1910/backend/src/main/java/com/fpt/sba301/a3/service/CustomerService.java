package com.fpt.sba301.a3.service;

import com.fpt.sba301.a3.dto.request.CustomerRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.CustomerResponse;

import java.util.List;

public interface CustomerService {

    List<CustomerResponse> getAllCustomers();

    List<CustomerResponse> searchCustomers(String keyword);

    CustomerResponse getCustomerById(Integer id);

    CustomerResponse createCustomer(CustomerRequest request);

    CustomerResponse updateCustomer(Integer id, CustomerRequest request);

    ApiResponse deleteCustomer(Integer id);
}

