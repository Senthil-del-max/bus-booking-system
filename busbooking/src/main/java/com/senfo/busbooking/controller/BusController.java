package com.senfo.busbooking.controller;

import com.senfo.busbooking.model.Bus;
import com.senfo.busbooking.repository.BusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bus")
public class BusController {

    @Autowired
    private BusRepository busRepository;

    @PostMapping("/add")
    public Bus addBus(@RequestBody Bus bus) {
        return busRepository.save(bus);
    }

    @GetMapping("/all")
    public List<Bus> getAllBuses() {
        return busRepository.findAll();
    }

    @GetMapping("/search")
    public List<Bus> searchBus(@RequestParam String from,
                               @RequestParam String to) {
        return busRepository.findByFromLocationAndToLocation(from, to);
    }
}