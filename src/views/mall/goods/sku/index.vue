<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="所属商品" prop="goodsId">
        <el-select v-model="queryParams.goodsId" filterable clearable placeholder="请选择商品">
          <el-option v-for="item in goodsOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="请选择状态">
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['mall:sku:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-magic-stick" size="mini" @click="openBatchCreate" v-hasPermi="['mall:sku:add']">批量生成</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-edit-outline" size="mini" :disabled="multiple" @click="openBatchUpdate" v-hasPermi="['mall:sku:edit']">批量改价库存</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['mall:sku:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['mall:sku:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-alert
      v-if="currentGoods.id"
      class="mb8"
      type="info"
      :closable="false"
      show-icon
      :title="`当前商品：${currentGoods.name}（ID: ${currentGoods.id}）`"
      :description="currentGoods.subTitle || '从商品页跳转后，SKU 默认按当前商品过滤，也可以直接批量生成规格组合。'"
    />

    <el-table v-loading="loading" :data="skuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="SKU ID" align="center" prop="id" width="100" />
      <el-table-column label="所属商品" align="center" min-width="180">
        <template slot-scope="scope">{{ getGoodsName(scope.row.goodsId) }}</template>
      </el-table-column>
      <el-table-column label="SKU编码" align="center" prop="skuCode" min-width="160" />
      <el-table-column label="SKU名称" align="center" prop="name" min-width="180" />
      <el-table-column label="规格组合" align="center" min-width="220">
        <template slot-scope="scope">
          <div v-if="parseSpecs(scope.row.specs).length" class="spec-tag-wrap">
            <el-tag v-for="item in parseSpecs(scope.row.specs)" :key="`${scope.row.id}-${item.groupId}-${item.valueId}`" size="mini" effect="plain">
              {{ item.groupName }}: {{ item.valueName }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="imageUrl" width="90">
        <template slot-scope="scope">
          <el-image v-if="scope.row.imageUrl" :src="scope.row.imageUrl" fit="cover" class="sku-image" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="110">
        <template slot-scope="scope">¥{{ formatPrice(scope.row.price) }}</template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="stockNum" width="90" />
      <el-table-column label="排序" align="center" prop="sortOrder" width="90" />
      <el-table-column label="状态" align="center" prop="status" width="90">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">{{ scope.row.status === 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">{{ parseTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['mall:sku:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['mall:sku:remove']">删除</el-button>
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

    <el-dialog :title="title" :visible.sync="open" width="820px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属商品" prop="goodsId">
              <el-select v-model="form.goodsId" filterable placeholder="请选择商品" style="width: 100%;" :disabled="form.id !== undefined">
                <el-option v-for="item in goodsOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input v-model="form.skuCode" placeholder="请输入SKU编码" :disabled="form.id !== undefined" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="SKU名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入SKU名称" maxlength="80" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售价(元)" prop="priceYuan">
              <el-input-number v-model="form.priceYuan" controls-position="right" :min="0" :precision="2" :step="0.01" style="width: 100%;" />
            </el-form-item>
            <el-form-item label="库存" prop="stockNum">
              <el-input-number v-model="form.stockNum" controls-position="right" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="SKU图片" prop="imageUrl">
              <ImageUpload v-model="form.imageUrl" :limit="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="form.sortOrder" controls-position="right" :min="0" />
            </el-form-item>
            <el-form-item v-if="form.id !== undefined" label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">规格属性</el-divider>
        <el-empty v-if="!activeSpecGroups.length" description="当前商品未配置规格模板，可先到商品页选择规格模板，或到属性管理中维护 type=规格 的父子属性。" :image-size="80" />
        <el-row v-else :gutter="20">
          <el-col v-for="group in activeSpecGroups" :key="group.id" :span="12">
            <el-form-item :label="group.name">
              <el-select v-model="formSpecSelections[group.id]" clearable filterable placeholder="请选择规格值" style="width: 100%;">
                <el-option v-for="child in group.children" :key="child.id" :label="child.name" :value="child.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="text" @click="fillSingleSkuName">按规则生成SKU名称</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量生成SKU" :visible.sync="batchOpen" width="960px" append-to-body>
      <el-alert
        type="warning"
        :closable="false"
        show-icon
        title="当前按规格值组合生成 SKU，建议先在属性管理里维护规格父项和规格值子项。"
        description="每个勾选组合会生成一条 SKU，默认价格、图片和排序可统一下发。"
      />
      <el-form label-width="110px" class="batch-form">
        <el-form-item label="当前商品">
          <el-tag v-if="currentGoods.id" type="success">{{ currentGoods.name }} #{{ currentGoods.id }}</el-tag>
          <span v-else class="text-muted">请先选择商品并搜索，或从商品页跳转进入。</span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="编码前缀">
              <el-input v-model="batchForm.skuCodePrefix" placeholder="例如 SKU" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="默认售价(元)">
              <el-input-number v-model="batchForm.defaultPriceYuan" controls-position="right" :min="0" :precision="2" :step="0.01" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="默认库存">
              <el-input-number v-model="batchForm.defaultStockNum" controls-position="right" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="起始排序">
              <el-input-number v-model="batchForm.sortStart" controls-position="right" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="命名规则">
              <el-input v-model="batchForm.skuNameRule" placeholder="例如：{goods_name} {spec_values}" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="默认图片">
          <ImageUpload v-model="batchForm.defaultImageUrl" :limit="1" />
        </el-form-item>
        <el-divider content-position="left">选择规格值</el-divider>
        <el-row :gutter="20" v-if="activeSpecGroups.length">
          <el-col v-for="group in activeSpecGroups" :key="`batch-${group.id}`" :span="12">
            <div class="spec-group-card">
              <div class="spec-group-title">{{ group.name }}</div>
              <el-checkbox-group v-model="batchForm.selectedSpecs[group.id]">
                <el-checkbox v-for="child in group.children" :key="child.id" :label="child.id">{{ child.name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
        </el-row>
        <el-empty v-else description="暂无可用规格属性" :image-size="80" />
        <el-divider content-position="left">生成预览</el-divider>
        <el-table :data="batchPreviewRows" border max-height="320">
          <el-table-column label="SKU编码" prop="skuCode" min-width="160" />
          <el-table-column label="SKU名称" prop="name" min-width="200" />
          <el-table-column label="规格组合" min-width="220">
            <template slot-scope="scope">
              <div class="spec-tag-wrap">
                <el-tag v-for="item in scope.row.specValues" :key="`${scope.row.skuCode}-${item.groupId}-${item.valueId}`" size="mini" effect="plain">
                  {{ item.groupName }}: {{ item.valueName }}
                </el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" width="100">
            <template slot-scope="scope">¥{{ scope.row.priceYuan.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="库存" prop="stockNum" width="90" />
          <el-table-column label="排序" prop="sortOrder" width="90" />
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!batchPreviewRows.length" @click="submitBatchCreate">批量创建</el-button>
        <el-button @click="batchOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="批量修改价格/库存" :visible.sync="batchUpdateOpen" width="720px" append-to-body>
      <el-form label-width="110px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="统一售价(元)">
              <el-input-number v-model="batchUpdateForm.priceYuan" controls-position="right" :min="0" :precision="2" :step="0.01" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一库存">
              <el-input-number v-model="batchUpdateForm.stockNum" controls-position="right" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="统一状态">
              <el-select v-model="batchUpdateForm.status" style="width: 100%;">
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="selectedSkuRows" border max-height="320">
        <el-table-column label="SKU编码" prop="skuCode" min-width="150" />
        <el-table-column label="SKU名称" prop="name" min-width="180" />
        <el-table-column label="当前价格" width="100">
          <template slot-scope="scope">¥{{ formatPrice(scope.row.price) }}</template>
        </el-table-column>
        <el-table-column label="当前库存" prop="stockNum" width="90" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitBatchUpdate">确 定</el-button>
        <el-button @click="batchUpdateOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listSku, getSku, addSku, updateSku, delSku, batchCreateSku, batchUpdateSku } from "@/api/mall/goods/sku"
import { listGoods } from "@/api/mall/goods/goods"
import { listAttribute } from "@/api/mall/goods/attribute"

export default {
  name: "MallSku",
  data() {
    return {
      loading: false,
      showSearch: true,
      total: 0,
      skuList: [],
      goodsRows: [],
      goodsOptions: [],
      specGroups: [],
      currentGoods: {},
      selectedSkuRows: [],
      ids: [],
      single: true,
      multiple: true,
      open: false,
      batchOpen: false,
      batchUpdateOpen: false,
      title: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        goodsId: this.$route.query.goodsId ? Number(this.$route.query.goodsId) : undefined,
        status: undefined
      },
      form: {},
      formSpecSelections: {},
      batchForm: {
        skuCodePrefix: "SKU",
        defaultPriceYuan: 0,
        defaultStockNum: 0,
        defaultImageUrl: "",
        sortStart: 0,
        skuNameRule: "{goods_name} {spec_values}",
        selectedSpecs: {}
      },
      batchUpdateForm: {
        priceYuan: 0,
        stockNum: 0,
        status: 1
      },
      rules: {
        goodsId: [{ required: true, message: "所属商品不能为空", trigger: "change" }],
        skuCode: [{ required: true, message: "SKU编码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "SKU名称不能为空", trigger: "blur" }],
        priceYuan: [{ required: true, message: "售价不能为空", trigger: "change" }],
        imageUrl: [{ required: true, message: "SKU图片不能为空", trigger: "change" }]
      }
    }
  },
  computed: {
    batchPreviewRows() {
      if (!this.currentGoods.id) return []
      const selectedGroups = this.activeSpecGroups
        .map(group => ({
          group,
          values: (this.batchForm.selectedSpecs[group.id] || [])
            .map(id => group.children.find(child => child.id === id))
            .filter(Boolean)
        }))
        .filter(item => item.values.length)
      if (!selectedGroups.length) return []

      const combos = this.buildCartesian(selectedGroups)
      return combos.map((specValues, index) => {
        const skuCode = `${this.batchForm.skuCodePrefix || "SKU"}-${this.currentGoods.id}-${String(index + 1).padStart(3, "0")}`
        const nameSuffix = specValues.map(item => item.valueName).join(" / ")
        return {
          goodsId: this.currentGoods.id,
          skuCode,
          name: this.renderSkuName(nameSuffix),
          priceYuan: Number(this.batchForm.defaultPriceYuan || 0),
          stockNum: Number(this.batchForm.defaultStockNum || 0),
          imageUrl: this.batchForm.defaultImageUrl,
          sortOrder: Number(this.batchForm.sortStart || 0) + index,
          specValues,
          specs: JSON.stringify(specValues)
        }
      })
    },
    activeSpecGroups() {
      const template = this.currentGoods.attributeTemplate || []
      if (!template.length) return this.specGroups
      return this.specGroups.filter(group => template.includes(group.id))
    }
  },
  created() {
    this.loadBaseData()
    this.getList()
  },
  methods: {
    async loadBaseData() {
      await Promise.all([this.loadGoodsOptions(), this.loadSpecGroups()])
      this.syncCurrentGoods()
    },
    async loadGoodsOptions() {
      const response = await listGoods({ pageNum: 1, pageSize: 300 })
      this.goodsRows = (response.rows || []).map(this.normalizeGoods)
      this.goodsOptions = this.goodsRows.map(row => ({
        label: `${row.name} #${row.id}`,
        value: row.id
      }))
    },
    async loadSpecGroups() {
      const response = await listAttribute({ pageNum: 1, pageSize: 200, type: 1, parentId: 0 })
      const parents = (response.rows || []).map(this.normalizeAttribute)
      const groups = await Promise.all(parents.map(async parent => {
        const childResp = await listAttribute({ pageNum: 1, pageSize: 200, parentId: parent.id })
        return {
          ...parent,
          children: (childResp.rows || []).map(this.normalizeAttribute)
        }
      }))
      this.specGroups = groups.filter(item => item.children.length > 0)
    },
    getList() {
      this.loading = true
      listSku(this.queryParams).then(response => {
        this.skuList = (response.rows || []).map(this.normalizeSku)
        this.total = response.total || 0
      }).finally(() => {
        this.loading = false
      })
    },
    normalizeAttribute(row) {
      return {
        id: row.id,
        parentId: row.parentId ?? row.parent_id,
        name: row.name
      }
    },
    normalizeGoods(row) {
      return {
        id: row.id,
        name: row.name,
        subTitle: row.subTitle ?? row.sub_title,
        attributeTemplate: row.attributeTemplate ?? row.attribute_template ?? [],
        skuNameRule: row.skuNameRule ?? row.sku_name_rule ?? "{goods_name} {spec_values}"
      }
    },
    normalizeSku(row) {
      if (!row) return {}
      return {
        id: row.id,
        goodsId: row.goodsId ?? row.goods_id,
        skuCode: row.skuCode ?? row.sku_code,
        name: row.name,
        price: row.price,
        priceYuan: this.toYuan(row.price),
        stockNum: row.stockNum ?? row.stock_num ?? 0,
        imageUrl: row.imageUrl ?? row.image_url,
        sortOrder: row.sortOrder ?? row.sort_order,
        specs: row.specs,
        status: row.status,
        createTime: row.createTime ?? row.create_time,
        updateTime: row.updateTime ?? row.update_time
      }
    },
    reset() {
      this.form = {
        id: undefined,
        goodsId: this.queryParams.goodsId,
        skuCode: "",
        name: "",
        price: 0,
        priceYuan: 0,
        stockNum: 0,
        imageUrl: "",
        sortOrder: 0,
        specs: "",
        status: 1
      }
      this.formSpecSelections = {}
      this.resetForm("form")
    },
    resetBatchForm() {
      this.batchForm = {
        skuCodePrefix: "SKU",
        defaultPriceYuan: 0,
        defaultStockNum: 0,
        defaultImageUrl: "",
        sortStart: 0,
        skuNameRule: this.currentGoods.skuNameRule || "{goods_name} {spec_values}",
        selectedSpecs: {}
      }
    },
    cancel() {
      this.open = false
      this.reset()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.syncCurrentGoods()
      this.getList()
    },
    resetQuery() {
      this.resetForm("queryForm")
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        goodsId: undefined,
        status: undefined
      }
      this.currentGoods = {}
      this.getList()
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.selectedSkuRows = selection
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "新增SKU"
    },
    handleUpdate(row) {
      const id = row?.id || this.ids[0]
      this.reset()
      getSku(id).then(response => {
        this.form = this.normalizeSku(response.data)
        this.applyFormSpecSelections(this.form.specs)
        this.open = true
        this.title = "修改SKU"
      })
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        const payload = {
          ...this.form,
          price: this.toFen(this.form.priceYuan),
          specs: this.buildSingleSpecs(),
          stockNum: this.form.stockNum
        }
        const request = payload.id !== undefined ? updateSku(payload) : addSku(payload)
        request.then(() => {
          this.$modal.msgSuccess(payload.id !== undefined ? "修改成功" : "新增成功")
          this.open = false
          this.getList()
        })
      })
    },
    handleDelete(row) {
      const ids = row?.id ? [row.id] : this.ids
      this.$modal.confirm(`是否确认删除SKU编号为"${ids.join(",")}"的数据项？`).then(() => {
        return Promise.all(ids.map(id => delSku(id)))
      }).then(() => {
        this.$modal.msgSuccess("删除成功")
        this.getList()
      }).catch(() => {})
    },
    openBatchCreate() {
      if (!this.queryParams.goodsId) {
        this.$modal.msgWarning("请先选择商品并搜索后，再批量生成 SKU")
        return
      }
      this.syncCurrentGoods()
      this.resetBatchForm()
      this.batchOpen = true
    },
    openBatchUpdate() {
      if (!this.selectedSkuRows.length) {
        this.$modal.msgWarning("请先选择需要修改的 SKU")
        return
      }
      this.batchUpdateForm = {
        priceYuan: this.toYuan(this.selectedSkuRows[0].price),
        stockNum: this.selectedSkuRows[0].stockNum || 0,
        status: this.selectedSkuRows[0].status ?? 1
      }
      this.batchUpdateOpen = true
    },
    submitBatchCreate() {
      if (!this.batchPreviewRows.length) {
        this.$modal.msgWarning("请至少选择一组规格值")
        return
      }
      const items = this.batchPreviewRows.map(item => ({
        goodsId: item.goodsId,
        skuCode: item.skuCode,
        name: item.name,
        price: this.toFen(item.priceYuan),
        stockNum: item.stockNum,
        imageUrl: item.imageUrl,
        sortOrder: item.sortOrder,
        specs: item.specs
      }))
      batchCreateSku(items).then(() => {
        this.$modal.msgSuccess(`已批量创建 ${items.length} 条 SKU`)
        this.batchOpen = false
        this.getList()
      })
    },
    submitBatchUpdate() {
      const items = this.selectedSkuRows.map(item => ({
        id: item.id,
        price: this.toFen(this.batchUpdateForm.priceYuan),
        stockNum: this.batchUpdateForm.stockNum,
        sortOrder: item.sortOrder,
        status: this.batchUpdateForm.status
      }))
      batchUpdateSku(items).then(() => {
        this.$modal.msgSuccess(`已批量更新 ${items.length} 条 SKU`)
        this.batchUpdateOpen = false
        this.getList()
      })
    },
    getGoodsName(id) {
      return this.goodsOptions.find(item => item.value === id)?.label || id || "-"
    },
    syncCurrentGoods() {
      this.currentGoods = this.goodsRows.find(item => item.id === this.queryParams.goodsId) || {}
    },
    renderSkuName(specText) {
      const rule = this.batchForm.skuNameRule || this.currentGoods.skuNameRule || "{goods_name} {spec_values}"
      return rule
        .split("{goods_name}").join(this.currentGoods.name || "")
        .split("{spec_values}").join(specText || "")
        .replace(/\s+/g, " ")
        .trim()
    },
    parseSpecs(raw) {
      if (!raw) return []
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            groupId: item.groupId ?? item.group_id ?? 0,
            groupName: item.groupName ?? item.group_name ?? "",
            valueId: item.valueId ?? item.value_id ?? 0,
            valueName: item.valueName ?? item.value_name ?? ""
          }))
        }
      } catch (error) {
        return []
      }
      return []
    },
    applyFormSpecSelections(raw) {
      const selections = {}
      this.parseSpecs(raw).forEach(item => {
        if (item.groupId) {
          selections[item.groupId] = item.valueId
        }
      })
      this.formSpecSelections = selections
    },
    buildSingleSpecs() {
      const items = this.activeSpecGroups.map(group => {
        const valueId = this.formSpecSelections[group.id]
        const value = group.children.find(child => child.id === valueId)
        if (!value) return null
        return {
          groupId: group.id,
          groupName: group.name,
          valueId: value.id,
          valueName: value.name
        }
      }).filter(Boolean)
      return items.length ? JSON.stringify(items) : ""
    },
    fillSingleSkuName() {
      const specText = this.activeSpecGroups.map(group => {
        const valueId = this.formSpecSelections[group.id]
        const value = group.children.find(child => child.id === valueId)
        return value ? value.name : null
      }).filter(Boolean).join(" / ")
      this.form.name = this.renderSkuName(specText)
    },
    buildCartesian(groups) {
      return groups.reduce((result, current) => {
        if (!result.length) {
          return current.values.map(item => [{
            groupId: current.group.id,
            groupName: current.group.name,
            valueId: item.id,
            valueName: item.name
          }])
        }
        return result.flatMap(prev => current.values.map(item => prev.concat([{
          groupId: current.group.id,
          groupName: current.group.name,
          valueId: item.id,
          valueName: item.name
        }])))
      }, [])
    },
    formatPrice(value) {
      return this.toYuan(value).toFixed(2)
    },
    toYuan(value) {
      return Number((Number(value || 0) / 100).toFixed(2))
    },
    toFen(value) {
      return Math.round(Number(value || 0) * 100)
    }
  }
}
</script>

<style scoped>
.sku-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.spec-tag-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.spec-group-card {
  min-height: 120px;
  padding: 14px 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
}

.spec-group-title {
  margin-bottom: 10px;
  font-weight: 600;
  color: #303133;
}

.batch-form {
  margin-top: 16px;
}

.text-muted {
  color: #909399;
}
</style>
