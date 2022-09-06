package com.yesenergy.api.view;

import java.util.ArrayList;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.validation.BindingResult;
import org.springframework.web.servlet.view.AbstractView;

import com.fasterxml.jackson.databind.ObjectMapper;

public class YesJSONView extends AbstractView {
    private ThreadLocal<ObjectMapper> objectMapper = new ThreadLocal<ObjectMapper>();

    public YesJSONView() {
        ObjectMapper localMapper = objectMapper.get();
        if (localMapper == null) {
            localMapper = new ObjectMapper();
            objectMapper.set(localMapper);
        }
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        response.setContentType("application/json;charset=utf-8");
        ArrayList<Object> list = new ArrayList<Object>();
        for (Entry<?,?> entry : model.entrySet()) {
            Object obj = entry.getValue();
            if (obj instanceof BindingResult)
                continue;
            if (obj instanceof ArrayList<?>) {
                ArrayList<?> sublist = (ArrayList<?>) obj;
                list.addAll(sublist);
            }
        }

        objectMapper.get().writeValue(response.getOutputStream(), list);
    }

}
