<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入商品名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="queryParams.categoryId" filterable clearable placeholder="请选择分类">
          <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="品牌" prop="brandId">
        <el-select v-model="queryParams.brandId" filterable clearable placeholder="请选择品牌">
          <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" prop="vendorId">
        <el-select v-model="queryParams.vendorId" filterable clearable placeholder="请选择供应商">
          <el-option v-for="item in vendorOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择状态">
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['mall:goods:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['mall:goods:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['mall:goods:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-alert
      v-if="queryParams.vendorId"
      class="mb8"
      type="info"
      :closable="false"
      show-icon
      :title="`当前按供应商筛选：${getVendorName(queryParams.vendorId)}`"
      description="可从供应商页直接跳转到这里查看该供应商下的商品。"
    />

    <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品ID" align="center" prop="id" width="100" />
      <el-table-column label="商品主图" align="center" prop="mainImage" width="90">
        <template slot-scope="scope">
          <el-image v-if="scope.row.mainImage" :src="scope.row.mainImage" fit="cover" class="goods-image" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" align="center" prop="name" min-width="180" />
      <el-table-column label="副标题" align="center" prop="subTitle" min-width="180" />
      <el-table-column label="分类" align="center" min-width="160">
        <template slot-scope="scope">{{ getCategoryName(scope.row.categoryId) }}</template>
      </el-table-column>
      <el-table-column label="品牌" align="center" min-width="140">
        <template slot-scope="scope">{{ getBrandName(scope.row.brandId) }}</template>
      </el-table-column>
      <el-table-column label="供应商" align="center" min-width="160">
        <template slot-scope="scope">{{ getVendorName(scope.row.vendorId) }}</template>
      </el-table-column>
      <el-table-column label="规格模板" align="center" min-width="90">
        <template slot-scope="scope">{{ (scope.row.attributeTemplate || []).length }} 组</template>
      </el-table-column>
      <el-table-column label="图集" align="center" min-width="90">
        <template slot-scope="scope">{{ getGalleryCount(scope.row.galleryImages) }} 张</template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sortOrder" width="90" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.status === 1 ? '上架' : '下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="190">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['mall:goods:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-s-grid" @click="goSku(scope.row)">SKU</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['mall:goods:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="980px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入商品名称" maxlength="80" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="副标题" prop="subTitle">
              <el-input v-model="form.subTitle" placeholder="请输入商品副标题" maxlength="120" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="商品分类" prop="categoryId">
              <el-select v-model="form.categoryId" filterable placeholder="请选择分类" style="width: 100%;">
                <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品品牌" prop="brandId">
              <el-select v-model="form.brandId" filterable placeholder="请选择品牌" style="width: 100%;">
                <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商" prop="vendorId">
              <el-select v-model="form.vendorId" filterable placeholder="请选择供应商" style="width: 100%;">
                <el-option v-for="item in vendorOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主图上传" prop="mainImage">
              <ImageUpload v-model="form.mainImage" :limit="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品图集" prop="galleryImages">
              <ImageUpload v-model="form.galleryImages" :limit="8" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="规格模板" prop="attributeTemplate">
              <el-select v-model="form.attributeTemplate" multiple filterable collapse-tags placeholder="请选择规格模板" style="width: 100%;">
                <el-option v-for="item in specTemplateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="命名规则" prop="skuNameRule">
              <el-input v-model="form.skuNameRule" placeholder="例如：{goods_name} {spec_values}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item v-if="form.id !== undefined" label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="商品详情" prop="detail">
          <Editor v-model="form.detail" :min-height="280" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listGoods, getGoods, addGoods, updateGoods, delGoods } from "@/api/mall/goods/goods"
import { listCategory } from "@/api/mall/goods/category"
import { listBrand } from "@/api/mall/goods/brand"
import { listVendor } from "@/api/mall/goods/vendor"
import { listAttribute } from "@/api/mall/goods/attribute"

export default {
  name: "MallGoods",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      goodsList: [],
      ids: [],
      single: true,
      multiple: true,
      open: false,
      title: "",
      categoryOptions: [],
      brandOptions: [],
      vendorOptions: [],
      specTemplateOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        categoryId: undefined,
        brandId: undefined,
        vendorId: this.$route.query.vendorId ? Number(this.$route.query.vendorId) : undefined,
        status: undefined
      },
      form: {},
      rules: {
        name: [{ required: true, message: "商品名称不能为空", trigger: "blur" }],
        categoryId: [{ required: true, message: "商品分类不能为空", trigger: "change" }],
        brandId: [{ required: true, message: "商品品牌不能为空", trigger: "change" }],
        vendorId: [{ required: true, message: "供应商不能为空", trigger: "change" }],
        mainImage: [{ required: true, message: "商品主图不能为空", trigger: "change" }]
      }
    }
  },
  created() {
    this.loadOptions()
    this.getList()
  },
  methods: {
    async loadOptions() {
      const [categoryResp, brandResp, vendorResp, specResp] = await Promise.all([
        listCategory({ pageNum: 1, pageSize: 200, status: 1 }),
        listBrand({ pageNum: 1, pageSize: 200, status: 1 }),
        listVendor({ pageNum: 1, pageSize: 200, status: 1 }),
        listAttribute({ pageNum: 1, pageSize: 200, type: 1, parentId: 0 })
      ])
      this.categoryOptions = (categoryResp.rows || []).map(item => {
        const row = this.normalizeCategory(item)
        return { label: `${row.name} #${row.id}`, value: row.id }
      })
      this.brandOptions = (brandResp.rows || []).map(item => ({ label: `${item.name} #${item.id}`, value: item.id }))
      this.vendorOptions = (vendorResp.rows || []).map(item => {
        const row = this.normalizeVendor(item)
        return { label: `${row.name} #${row.id}`, value: row.id }
      })
      this.specTemplateOptions = (specResp.rows || []).map(item => ({
        label: `${item.name} #${item.id}`,
        value: item.id
      }))
    },
    getList() {
      this.loading = true
      listGoods(this.queryParams).then(response => {
        this.goodsList = (response.rows || []).map(this.normalizeGoods)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeCategory(row) {
      return {
        id: row.id,
        name: row.name
      }
    },
    normalizeVendor(row) {
      return {
        id: row.id,
        name: row.name
      }
    },
    normalizeGoods(row) {
      if (!row) return {}
      return {
        id: row.id,
        categoryId: row.categoryId ?? row.category_id,
        vendorId: row.vendorId ?? row.vendor_id,
        brandId: row.brandId ?? row.brand_id,
        name: row.name,
        subTitle: row.subTitle ?? row.sub_title,
        mainImage: row.mainImage ?? row.main_image,
        galleryImages: this.joinImages(row.galleryImages ?? row.gallery_images),
        attributeTemplate: row.attributeTemplate ?? row.attribute_template ?? [],
        skuNameRule: row.skuNameRule ?? row.sku_name_rule ?? "{goods_name} {spec_values}",
        detail: row.detail,
        sortOrder: row.sortOrder ?? row.sort_order,
        status: row.status,
        createTime: row.createTime ?? row.create_time,
        updateTime: row.updateTime ?? row.update_time
      }
    },
    reset() {
      this.form = {
        id: undefined,
        categoryId: undefined,
        vendorId: undefined,
        brandId: undefined,
        name: "",
        subTitle: "",
        mainImage: "",
        galleryImages: "",
        attributeTemplate: [],
        skuNameRule: "{goods_name} {spec_values}",
        detail: "",
        sortOrder: 0,
        status: 1
      }
      this.resetForm("form")
    },
    cancel() {
      this.open = false
      this.reset()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        categoryId: undefined,
        brandId: undefined,
        vendorId: undefined,
        status: undefined
      }
      this.getList()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "新增商品"
    },
    handleUpdate(row) {
      const id = row?.id || this.ids[0]
      this.reset()
      getGoods(id).then(response => {
        this.form = this.normalizeGoods(response.data)
        this.open = true
        this.title = "修改商品"
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const request = this.form.id !== undefined ? updateGoods(this.form) : addGoods(this.form)
        request.then(() => {
          this.$modal.msgSuccess(this.form.id !== undefined ? "修改成功" : "新增成功")
          this.open = false
          this.getList()
        })
      })
    },
    handleDelete(row) {
      const ids = row?.id ? [row.id] : this.ids
      this.$modal.confirm(`是否确认删除商品编号为"${ids.join(",")}"的数据项？`).then(() => {
        return Promise.all(ids.map(id => delGoods(id)))
      }).then(() => {
        this.$modal.msgSuccess("删除成功")
        this.getList()
      }).catch(() => {})
    },
    getCategoryName(id) {
      return this.categoryOptions.find(item => item.value === id)?.label || id || "-"
    },
    getBrandName(id) {
      return this.brandOptions.find(item => item.value === id)?.label || id || "-"
    },
    getVendorName(id) {
      return this.vendorOptions.find(item => item.value === id)?.label || id || "-"
    },
    joinImages(value) {
      if (!value) return ""
      return Array.isArray(value) ? value.join(",") : value
    },
    getGalleryCount(value) {
      return this.joinImages(value).split(",").filter(Boolean).length
    },
    goSku(row) {
      this.$router.push({
        path: "/mall/goods/sku",
        query: { goodsId: row.id }
      })
    }
  }
}
</script>

<style scoped>
.goods-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
</style>
