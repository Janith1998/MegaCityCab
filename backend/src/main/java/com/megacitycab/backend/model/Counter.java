package com.megacitycab.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "counters")
public class Counter {
    
    @Id
    private String id;
    private int sequence_value;

    public Counter() {}

    public Counter(String id, int sequence_value) {
        this.id = id;
        this.sequence_value = sequence_value;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getSequence_value() {
        return sequence_value;
    }

    public void setSequence_value(int sequence_value) {
        this.sequence_value = sequence_value;
    }
}
