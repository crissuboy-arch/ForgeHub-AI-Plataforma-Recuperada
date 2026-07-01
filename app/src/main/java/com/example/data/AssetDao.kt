package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface AssetDao {
    @Query("SELECT * FROM assets ORDER BY isCustom DESC, title ASC")
    fun getAllAssets(): Flow<List<AssetEntity>>

    @Query("SELECT * FROM assets WHERE id = :id LIMIT 1")
    suspend fun getAssetById(id: String): AssetEntity?

    @Query("SELECT * FROM assets WHERE id = :id LIMIT 1")
    fun getAssetByIdFlow(id: String): Flow<AssetEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAsset(asset: AssetEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAssets(assets: List<AssetEntity>)

    @Update
    suspend fun updateAsset(asset: AssetEntity)

    @Query("SELECT * FROM activities ORDER BY timestamp DESC LIMIT 50")
    fun getAllActivities(): Flow<List<ActivityEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertActivity(activity: ActivityEntity)
}
