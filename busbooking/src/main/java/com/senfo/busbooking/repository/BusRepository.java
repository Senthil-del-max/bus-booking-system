package com.senfo.busbooking.repository;

import com.senfo.busbooking.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusRepository extends JpaRepository<Bus, Long> {

    List<Bus> findByFromLocationAndToLocation(String fromLocation, String toLocation);
}