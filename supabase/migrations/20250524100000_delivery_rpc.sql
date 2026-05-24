-- allocate_inventory RPC (Week 4)

CREATE OR REPLACE FUNCTION public.allocate_inventory(
  p_order_item_id uuid,
  p_qty int DEFAULT 1
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_id uuid;
  v_allocated int := 0;
  r record;
BEGIN
  IF p_qty < 1 THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_qty');
  END IF;

  SELECT product_id INTO v_product_id
  FROM order_items
  WHERE id = p_order_item_id;

  IF v_product_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_item_not_found');
  END IF;

  FOR r IN
    SELECT id
    FROM delivery_inventory
    WHERE product_id = v_product_id
      AND status = 'available'
    ORDER BY created_at ASC
    LIMIT p_qty
    FOR UPDATE SKIP LOCKED
  LOOP
    UPDATE delivery_inventory
    SET
      status = 'allocated',
      order_item_id = p_order_item_id,
      allocated_at = NOW()
    WHERE id = r.id;

    v_allocated := v_allocated + 1;
  END LOOP;

  IF v_allocated < p_qty THEN
    RETURN jsonb_build_object(
      'success', false,
      'allocated_count', v_allocated,
      'error', 'insufficient_stock'
    );
  END IF;

  UPDATE order_items
  SET fulfillment_status = 'allocated'
  WHERE id = p_order_item_id;

  RETURN jsonb_build_object('success', true, 'allocated_count', v_allocated);
END;
$$;

REVOKE ALL ON FUNCTION public.allocate_inventory(uuid, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.allocate_inventory(uuid, int) TO service_role;
