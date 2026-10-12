package com.campuscycle.config;

import com.campuscycle.entity.Domain;
import com.campuscycle.entity.embedded.Category;
import com.campuscycle.entity.embedded.Item;
import com.campuscycle.repository.DomainRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DomainSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DomainSeeder.class);

    private final DomainRepository domainRepository;

    public DomainSeeder(DomainRepository domainRepository) {
        this.domainRepository = domainRepository;
    }

    @Override
    public void run(String... args) {
        if (domainRepository.count() > 0) {
            log.info("Domains already seeded ({} rows)", domainRepository.count());
            return;
        }
        domainRepository.saveAll(seedDomains());
        log.info("Seeded {} domains", domainRepository.count());
    }

    private List<Domain> seedDomains() {
        Domain academics = domain("Academics", "academics", "📚", List.of(
                category("Books", "books", List.of(
                        item("Textbooks", "textbooks", "textbook", "academic"),
                        item("Reference Books", "reference-books", "reference", "academic"),
                        item("Novels", "novels", "novel", "reading"))),
                category("Calculators", "calculators", List.of(
                        item("Scientific Calculator", "scientific-calculator", "calculator", "scientific"),
                        item("Graphing Calculator", "graphing-calculator", "calculator", "graphing"))),
                category("Laboratory Equipment", "laboratory-equipment", List.of(
                        item("Lab Coat", "lab-coat", "labcoat", "laboratory"),
                        item("Microscope", "microscope", "microscope", "laboratory"))),
                category("Drawing Materials", "drawing-materials", List.of(
                        item("Drawing Board", "drawing-board", "drawing", "engineering"),
                        item("Compass Set", "compass-set", "compass", "drawing")))));

        Domain projects = domain("Projects & Electronics", "projects-electronics", "🔌", List.of(
                category("Arduino", "arduino", List.of(
                        item("Arduino Uno", "arduino-uno", "arduino", "electronics", "project"),
                        item("Arduino Mega", "arduino-mega", "arduino", "electronics", "project"),
                        item("Arduino Nano", "arduino-nano", "arduino", "electronics", "project"))),
                category("Raspberry Pi", "raspberry-pi", List.of(
                        item("Raspberry Pi 4", "raspberry-pi-4", "raspberrypi", "electronics", "project"),
                        item("Raspberry Pi Zero", "raspberry-pi-zero", "raspberrypi", "electronics"))),
                category("Sensors", "sensors", List.of(
                        item("Temperature Sensor", "temperature-sensor", "sensor", "electronics"),
                        item("Ultrasonic Sensor", "ultrasonic-sensor", "sensor", "electronics"))),
                category("Components", "components", List.of(
                        item("Breadboard", "breadboard", "breadboard", "electronics"),
                        item("Jumper Wires", "jumper-wires", "jumperwires", "electronics"),
                        item("Resistors Pack", "resistors-pack", "resistors", "electronics"))),
                category("Tools", "tools", List.of(
                        item("Soldering Iron", "soldering-iron", "soldering", "tools"),
                        item("Multimeter", "multimeter", "multimeter", "tools", "electronics")))));

        Domain hostel = domain("Hostel & Campus Life", "hostel-campus-life", "🏠", List.of(
                category("Furniture", "furniture", List.of(
                        item("Study Table", "study-table", "table", "furniture", "hostel"),
                        item("Chair", "chair", "chair", "furniture", "hostel"))),
                category("Electronics", "hostel-electronics", List.of(
                        item("Desk Lamp", "desk-lamp", "lamp", "hostel"),
                        item("Extension Board", "extension-board", "extension", "hostel"))),
                category("Room Essentials", "room-essentials", List.of(
                        item("Bed Sheet", "bed-sheet", "bedsheet", "hostel"),
                        item("Pillow", "pillow", "pillow", "hostel")))));

        Domain sports = domain("Sports & Fitness", "sports-fitness", "⚽", List.of(
                category("Cycles", "cycles", List.of(
                        item("Mountain Bike", "mountain-bike", "cycle", "sports"),
                        item("City Bike", "city-bike", "cycle", "sports"))),
                category("Sports Equipment", "sports-equipment", List.of(
                        item("Cricket Bat", "cricket-bat", "cricket", "sports"),
                        item("Football", "football", "football", "sports"),
                        item("Badminton Racket", "badminton-racket", "badminton", "sports"))),
                category("Fitness", "fitness", List.of(
                        item("Dumbbells", "dumbbells", "fitness", "gym"),
                        item("Resistance Bands", "resistance-bands", "fitness", "exercise")))));

        Domain other = domain("Other Student Resources", "other-resources", "📦", List.of(
                category("Stationery", "stationery", List.of(
                        item("Pen Pack", "pen-pack", "stationery", "pens"),
                        item("Notebooks", "notebooks", "notebooks", "stationery"))),
                category("Notes & Study Material", "notes-study-material", List.of(
                        item("Handwritten Notes", "handwritten-notes", "notes", "study"),
                        item("Printouts", "printouts", "printouts", "study")))));

        return List.of(academics, projects, hostel, sports, other);
    }

    private Domain domain(String name, String slug, String icon, List<Category> categories) {
        Domain domain = new Domain();
        domain.setName(name);
        domain.setSlug(slug);
        domain.setIcon(icon);
        domain.setCategories(categories);
        return domain;
    }

    private Category category(String name, String slug, List<Item> items) {
        return new Category(name, slug, items);
    }

    private Item item(String name, String slug, String... defaultTags) {
        return new Item(name, slug, List.of(defaultTags));
    }
}
