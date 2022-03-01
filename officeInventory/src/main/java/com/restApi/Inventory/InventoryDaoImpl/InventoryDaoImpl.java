package com.restApi.Inventory.InventoryDaoImpl;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import com.restApi.Inventory.InventoryDao.InventoryDao;
import com.restApi.Inventory.model.InventoryDetail;

@Repository
public class InventoryDaoImpl implements InventoryDao {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	private static String Insert_Sql = "INSERT INTO `officeInventoryTable` (" + "InventoryName," + "SerialNumber,"
			+ "Category," + "Status," + "PurchaseDate," + "Notes)" + " VALUES(?,?,?,?,?,?)";

	private static String Update_Sql = "UPDATE officeInventoryTable SET " + "InventoryName = ?," + "SerialNumber = ?, "
			+ "Category= ? ," + "Status = ?," + "PurchaseDate =? ," + "Notes =? " + "WHERE Id = ? ";

	private static String Delete_Sql = "UPDATE officeInventoryTable SET " + " DeleteFlag = 'false' "
			+ " WHERE `Id` = ? ";

	private static String List_Sql = "SELECT id,InventoryName,SerialNumber,Category,Status,PurchaseDate FROM officeInventoryTable where DeleteFlag = 'true' ORDER BY`CreatedDate` ASC LIMIT 20 ";

	private static String ListById_Sql = "SELECT id,InventoryName,SerialNumber,Category,Status,PurchaseDate,Notes FROM officeInventoryTable where id = ? ";

	private static String filter_sql = "";

	public void addInventoryDetail(InventoryDetail inventoryDetail) {
		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(connection -> {
			PreparedStatement ps = connection.prepareStatement(Insert_Sql, Statement.RETURN_GENERATED_KEYS);
			ps.setString(1, inventoryDetail.getInventoryName());
			ps.setInt(2, inventoryDetail.getSerialNumber());
			ps.setString(3, inventoryDetail.getCategory());
			ps.setString(4, inventoryDetail.getStatus());
			ps.setDate(5, inventoryDetail.getPurchaseDate());
			ps.setString(6, inventoryDetail.getNotes());
			return ps;
		}, keyHolder);
//		return keyHolder.getKey().longValue();
	}

	public int updateInventoryDetail(InventoryDetail inventoryDetail) {
		return jdbcTemplate.update(Update_Sql,
				new Object[] { inventoryDetail.getInventoryName(), inventoryDetail.getSerialNumber(),
						inventoryDetail.getCategory(), inventoryDetail.getStatus(), inventoryDetail.getPurchaseDate(),
						inventoryDetail.getNotes(), inventoryDetail.getId() });
	}

	public int deleteInventoryDetail(InventoryDetail inventoryDetail) {
		return jdbcTemplate.update(Delete_Sql, inventoryDetail.getId());

	}

	public List<InventoryDetail> getAllInventoryDetail() {
//		return jdbcTemplate.query(List_Sql, new BeanPropertyRowMapper<InventoryDetail>(InventoryDetail.class));
		return jdbcTemplate.query(List_Sql, new BeanPropertyRowMapper<InventoryDetail>(InventoryDetail.class));
	}

	public List<InventoryDetail> getAllInventoryDetailById(InventoryDetail inventoryDetail) {
		return jdbcTemplate.query(ListById_Sql, new BeanPropertyRowMapper<InventoryDetail>(InventoryDetail.class),
				inventoryDetail.getId());
	}

	public List<InventoryDetail> getAllInventoryDetailFilter(String iName, String category, String startDate,
			String endDate, String cName,String sort,int limitval,int offSetval) {
		String condition_sql = " ";
		filter_sql = "SELECT id,InventoryName,SerialNumber,Category,Status,PurchaseDate ";
		if (iName == "" && category == "" && startDate == "") {
			condition_sql += ",(SELECT COUNT(InventoryName)FROM`officeInventoryTable` WHERE DeleteFlag ='true') AS countVal FROM officeInventoryTable where DeleteFlag = 'true'";
		} else if (iName != "" && category == "" && startDate == "") {
			condition_sql += " ,(SELECT COUNT(InventoryName)FROM`officeInventoryTable` WHERE `InventoryName` LIKE '%" + iName + "%' AND DeleteFlag='true') AS countVal FROM officeInventoryTable where `InventoryName` LIKE '%" + iName + "%' AND DeleteFlag = 'true'";
		} else if (iName == "" && category != "" && startDate == "") {
			condition_sql += " ,(SELECT COUNT(InventoryName)FROM`officeInventoryTable` WHERE `Category`='" + category + "' AND DeleteFlag='true') AS countVal FROM officeInventoryTable where `Category`='" + category + "' AND DeleteFlag = 'true'";
		} else if (iName == "" && category == "" && startDate != "") {
			condition_sql += "FROM officeInventoryTable where `PurchaseDate`BETWEEN'" + startDate + "'AND'" + endDate + "' AND DeleteFlag = 'true'";
		} else if (iName == "" && category != "" && startDate != "") {
			condition_sql += "FROM officeInventoryTable where `Category`='" + category + "'AND`PurchaseDate`BETWEEN'" + startDate + "'AND'" + endDate
					+ "' AND DeleteFlag = 'true'";
		} else if (iName != "" && category == "" && startDate != "") {
			condition_sql += "FROM officeInventoryTable where `InventoryName`='" + iName + "'AND`PurchaseDate`BETWEEN'" + startDate + "'AND'" + endDate
					+ "' AND DeleteFlag = 'true'";
		} else if (iName != "" && category != "" && startDate == "") {
			condition_sql += "FROM officeInventoryTable where `InventoryName`='" + iName + "'AND`Category`='" + category + "' AND DeleteFlag = 'true' ";
		} else {
			condition_sql += "FROM officeInventoryTable where `InventoryName`='" + iName + "'AND`Category`='" + category + "'AND`PurchaseDate`BETWEEN'"
					+ startDate + "'AND'" + endDate + "' AND DeleteFlag = 'true'";
		}
		filter_sql += condition_sql + " ORDER BY " + cName+"  "+sort+" LIMIT "+limitval+" OFFSET "+offSetval ;
		System.out.println(filter_sql);
		List<InventoryDetail> inventoryDetails;
		RowMapper<InventoryDetail> rowmapper = new BeanPropertyRowMapper<InventoryDetail>(InventoryDetail.class);
		inventoryDetails = jdbcTemplate.query(filter_sql, rowmapper);
		return inventoryDetails;
	}
}
