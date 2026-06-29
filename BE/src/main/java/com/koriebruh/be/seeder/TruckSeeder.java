package com.koriebruh.be.seeder;

import com.koriebruh.be.entity.Truck;
import com.koriebruh.be.repository.TruckRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(2)
public class TruckSeeder implements CommandLineRunner {

    @Autowired
    private TruckRepository truckRepository;

    private static final Logger log = LoggerFactory.getLogger(TruckSeeder.class);

    @Override
    public void run(String... args) throws Exception {

        List<Truck> trucks = Arrays.asList(
                createTruck("B 1234 ABC", "Hino Dutro 130 MD", "Barang Umum", 5000),
                createTruck("B 5678 DEF", "Mitsubishi Colt Diesel FE 74", "Bahan Bangunan", 7500),
                createTruck("B 9012 GHI", "Isuzu Elf NMR 71", "Makanan & Minuman", 4000),
                createTruck("B 3456 JKL", "Toyota Dyna 130 HT", "Elektronik", 6000),
                createTruck("B 7890 MNO", "Hino Ranger FL 235 JW", "Bahan Kimia", 15000)
        );

        for (Truck truck : trucks) {
            if (!truckRepository.existsByLicensePlate(truck.getLicensePlate())) {
                truckRepository.save(truck);
                log.info("✅ Truck seeded: {} - {}", truck.getLicensePlate(), truck.getModel());
            } else {
                log.info("ℹ️ Truck already exists: {}", truck.getLicensePlate());
            }
        }

        log.info("🎉 Truck seeding process completed!");
    }

    private Truck createTruck(String licensePlate, String model, String cargoType, double capacityKG) {
        Truck truck = new Truck();
        truck.setLicensePlate(licensePlate);
        truck.setModel(model);
        truck.setCargoType(cargoType);
        truck.setCapacityKG(capacityKG);
        truck.setIsAvailable(true);
        return truck;
    }
}
