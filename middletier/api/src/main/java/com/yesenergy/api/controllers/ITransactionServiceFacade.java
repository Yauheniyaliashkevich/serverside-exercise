package com.yesenergy.api.controllers;

import java.util.ArrayList;
import java.util.HashMap;

public interface ITransactionServiceFacade {
    public ArrayList<HashMap<String, Object>> getTransactionList();
}
