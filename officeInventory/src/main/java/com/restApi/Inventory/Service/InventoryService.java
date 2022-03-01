package com.restApi.Inventory.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restApi.Inventory.InventoryDao.InventoryDao;
import com.restApi.Inventory.model.InventoryDetail;

@Service
public class InventoryService {

	@Autowired
	InventoryDao inventoryDao;

	public void addInventoryService(InventoryDetail inventoryDetail) {
		inventoryDao.addInventoryDetail(inventoryDetail);

	}

	public void updateInventoryService(InventoryDetail inventoryDetail) {

		inventoryDao.updateInventoryDetail(inventoryDetail);
	}

	public void deleteInventoryService(InventoryDetail inventoryDetail) {
		inventoryDao.deleteInventoryDetail(inventoryDetail);

	}

	public List<InventoryDetail> getAllInventoryDetail() {
		return inventoryDao.getAllInventoryDetail();
	}

	public List<InventoryDetail> getAllInventoryDetailById(InventoryDetail inventoryDetail) {
		return inventoryDao.getAllInventoryDetailById(inventoryDetail);
	}

	public List<InventoryDetail> getAllInventoryDetailFilter(String iName, String category, String startDate,
			String endDate,String cName,String sort,int limitval,int offSetval) {
		return inventoryDao.getAllInventoryDetailFilter(iName, category, startDate, endDate,cName,sort,limitval,offSetval);
	}
}