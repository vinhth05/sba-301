package com.fpt.sba301.a3.service.impl;

import com.fpt.sba301.a3.dto.request.CustomerRequest;
import com.fpt.sba301.a3.dto.response.ApiResponse;
import com.fpt.sba301.a3.dto.response.CustomerResponse;
import com.fpt.sba301.a3.entity.Customer;
import com.fpt.sba301.a3.exception.BadRequestException;
import com.fpt.sba301.a3.exception.ResourceNotFoundException;
import com.fpt.sba301.a3.repository.BookingReservationRepository;
import com.fpt.sba301.a3.repository.CustomerRepository;
import com.fpt.sba301.a3.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookingReservationRepository bookingReservationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerResponse> searchCustomers(String keyword) {
        return customerRepository.searchCustomers(keyword).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerResponse getCustomerById(Integer id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return mapToResponse(c);
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        String email = request.getEmailAddress().trim();
        if (customerRepository.existsByEmailAddress(email)) {
            throw new BadRequestException("Email '" + email + "' is already registered.");
        }

        Customer c = new Customer();
        c.setCustomerFullName(request.getCustomerFullName().trim());
        c.setEmailAddress(email);
        c.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : null);
        c.setCustomerBirthday(request.getCustomerBirthday());
        c.setCustomerStatus(request.getCustomerStatus() != null ? request.getCustomerStatus() : 1);

        String pass = StringUtils.hasText(request.getPassword()) ? request.getPassword().trim() : "@1";
        c.setPassword(passwordEncoder.encode(pass));

        c = customerRepository.save(c);
        return mapToResponse(c);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Integer id, CustomerRequest request) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        String email = request.getEmailAddress().trim();
        if (customerRepository.existsByEmailAddressAndCustomerIDNot(email, id)) {
            throw new BadRequestException("Email '" + email + "' is already in use by another customer.");
        }

        c.setCustomerFullName(request.getCustomerFullName().trim());
        c.setEmailAddress(email);
        c.setTelephone(request.getTelephone() != null ? request.getTelephone().trim() : null);
        c.setCustomerBirthday(request.getCustomerBirthday());
        c.setCustomerStatus(request.getCustomerStatus());

        if (StringUtils.hasText(request.getPassword())) {
            c.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        c = customerRepository.save(c);
        return mapToResponse(c);
    }

    @Override
    @Transactional
    public ApiResponse deleteCustomer(Integer id) {
        Customer c = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        boolean hasBookings = bookingReservationRepository.existsByCustomerID(id);
        if (hasBookings) {
            c.setCustomerStatus(0);
            customerRepository.save(c);
            return ApiResponse.success("Khách hàng đã có lịch sử đặt phòng, hệ thống đã chuyển trạng thái sang Không hoạt động (Inactive).", mapToResponse(c));
        } else {
            customerRepository.delete(c);
            return ApiResponse.success("Đã xóa khách hàng thành công.");
        }
    }

    private CustomerResponse mapToResponse(Customer c) {
        CustomerResponse res = new CustomerResponse();
        res.setCustomerID(c.getCustomerID());
        res.setCustomerFullName(c.getCustomerFullName());
        res.setEmailAddress(c.getEmailAddress());
        res.setTelephone(c.getTelephone());
        res.setCustomerBirthday(c.getCustomerBirthday());
        res.setCustomerStatus(c.getCustomerStatus());
        res.setTotalBookings(bookingReservationRepository.findByCustomerIDOrderByBookingDateDesc(c.getCustomerID()).size());
        return res;
    }
}

