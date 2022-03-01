package com.restApi.Inventory.InventoryDao;

import java.util.List;

import com.restApi.Inventory.model.InventoryDetail;

public interface InventoryDao {

	void addInventoryDetail(InventoryDetail inventoryDetail);
	
	int updateInventoryDetail(InventoryDetail inventoryDetail);
	
	int deleteInventoryDetail(InventoryDetail inventoryDetail);     
	
	List<InventoryDetail> getAllInventoryDetail();
	
	List<InventoryDetail> getAllInventoryDetailById(InventoryDetail inventoryDetail);

	List<InventoryDetail> getAllInventoryDetailFilter(String iName, String category, String startDate, String endDate,String cName,String sort,int limitval,int offSetval);
}
